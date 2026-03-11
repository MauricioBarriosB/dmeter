import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Square, AudioWaveform, HelpCircle } from "lucide-react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from "@heroui/react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import SpectrumAnalyzer from "../components/SpectrumAnalyzer";
import RealTimeValuesPanel from "../components/RealTimeValuesPanel";
import AnalysisHistoryTable from "../components/AnalysisHistoryTable";
import type { AnalysisRecord, FrequencyPeak } from "../components/AnalysisHistoryTable";
import { loadAnalysisHistory, saveAnalysisHistory } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import { calculateDecibels } from "../helpers/decibelsHelper";
import UnauthorizedAlert from "../components/UnauthorizedAlert";

interface RealTimeData {
    currentDb: number;
    peakDb: number;
    avgDb: number;
    minDb: number;
    maxDb: number;
}

export default function Meter() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const historyLoaded = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisName, setAnalysisName] = useState("");
    const analysisNameRef = useRef("");
    const { isOpen: isStartOpen, onOpen: onStartOpen, onOpenChange: onStartOpenChange } = useDisclosure();
    const { isOpen: isFinishOpen, onOpen: onFinishOpen, onOpenChange: onFinishOpenChange } = useDisclosure();
    const { isOpen: isHelpOpen, onOpen: onHelpOpen, onOpenChange: onHelpOpenChange } = useDisclosure();
    const containerRef = useRef<HTMLDivElement>(null);
    const analyzerRef = useRef<AudioMotionAnalyzer | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const dbSamplesRef = useRef<number[]>([]);
    const isAnalyzingRef = useRef<boolean>(false);
    const spectrumMaxRef = useRef<Float32Array | null>(null);
    const [realTimeData, setRealTimeData] = useState<RealTimeData>({
        currentDb: -100,
        peakDb: -100,
        avgDb: -100,
        minDb: 0,
        maxDb: -100,
    });

    // Setup on mount and cleanup on unmount
    useEffect(() => {
        validateLicense().then(setisValid);
        loadAnalysisHistory().then((loaded) => {
            setHistory(loaded);
            historyLoaded.current = true;
        });

        return () => {
            isAnalyzingRef.current = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (analyzerRef.current) {
                analyzerRef.current.destroy();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Save history to localStorage when it changes (skip until loaded)
    useEffect(() => {
        if (!historyLoaded.current) {
            return;
        }
        saveAnalysisHistory(history);
    }, [history]);

    const updateAudioLevel = useCallback(() => {
        if (!analyserNodeRef.current || !isAnalyzingRef.current) return;

        const dataArray = new Uint8Array(analyserNodeRef.current.fftSize);
        analyserNodeRef.current.getByteTimeDomainData(dataArray);

        const currentDb = calculateDecibels(dataArray);
        dbSamplesRef.current.push(currentDb);

        // Capture frequency data and track maximum amplitudes
        const frequencyBinCount = analyserNodeRef.current.frequencyBinCount;
        const frequencyData = new Uint8Array(frequencyBinCount);
        analyserNodeRef.current.getByteFrequencyData(frequencyData);

        // Initialize spectrum max array if needed
        if (spectrumMaxRef.current?.length !== frequencyBinCount) {
            spectrumMaxRef.current = new Float32Array(frequencyBinCount).fill(-100);
        }

        // Update max values for each frequency bin
        for (let i = 0; i < frequencyBinCount; i++) {
            // Convert byte (0-255) to dB (-100 to 0 range approximately)
            const dbValue = (frequencyData[i] / 255) * 100 - 100;
            if (dbValue > spectrumMaxRef.current[i]) {
                spectrumMaxRef.current[i] = dbValue;
            }
        }

        setRealTimeData((prev) => {
            const newPeak = Math.max(prev.peakDb, currentDb);
            const newMax = Math.max(prev.maxDb, currentDb);

            // Only update min when there's actual sound (above noise floor of -80 dB)
            // This prevents silence from always being the minimum
            const NOISE_FLOOR = -80;
            let newMin = prev.minDb;
            if (currentDb > NOISE_FLOOR) {
                // If minDb is still at initial value (0), set it to current
                // Otherwise, take the minimum of actual sound readings
                newMin = prev.minDb === 0 ? currentDb : Math.min(prev.minDb, currentDb);
            }

            const avgDb = dbSamplesRef.current.reduce((a, b) => a + b, 0) / dbSamplesRef.current.length;

            return {
                currentDb: Math.round(currentDb * 10) / 10,
                peakDb: Math.round(newPeak * 10) / 10,
                avgDb: Math.round(avgDb * 10) / 10,
                minDb: Math.round(newMin * 10) / 10,
                maxDb: Math.round(newMax * 10) / 10,
            };
        });

        animationRef.current = requestAnimationFrame(updateAudioLevel);
    }, []);

    const handleStartAnalisis = async () => {
        try {
            setError(null);

            // Get available audio input devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter((d) => d.kind === "audioinput");

            if (audioInputs.length === 0) {
                setError("No microphone found on this device.");
                return;
            }

            // Request microphone access with multiple fallback strategies
            let stream: MediaStream | null = null;
            const errors: string[] = [];

            // Strategy 1: Try with specific device and no processing
            for (const device of audioInputs) {
                if (stream) break;
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: { exact: device.deviceId },
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                        },
                    });
                } catch (e) {
                    errors.push(`Device ${device.label || device.deviceId}: ${(e as Error).message}`);
                }
            }

            // Strategy 2: Try with any device, no processing
            if (!stream) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                        },
                    });
                } catch (e) {
                    errors.push(`No processing: ${(e as Error).message}`);
                }
            }

            // Strategy 3: Try with basic audio (browser defaults)
            if (!stream) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
                } catch (e) {
                    errors.push(`Basic: ${(e as Error).message}`);
                }
            }

            if (!stream) {
                console.error("All strategies failed:", errors);
                throw new Error("NotReadableError");
            }

            streamRef.current = stream;

            // Create Audio Context
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Create source from microphone
            const source = audioContext.createMediaStreamSource(stream);

            // Create analyser node for dB calculation
            const analyserNode = audioContext.createAnalyser();
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.8;
            analyserNodeRef.current = analyserNode;

            source.connect(analyserNode);

            // Initialize audiomotion-analyzer for visualization
            if (containerRef.current) {
                analyzerRef.current = new AudioMotionAnalyzer(containerRef.current, {
                    source: source,
                    height: 300,
                    mode: 3,
                    barSpace: 0.4,
                    ledBars: true,
                    showScaleX: true,
                    showScaleY: true,
                    showPeaks: true,
                    peakLine: false,
                    gradient: "rainbow",
                    minDecibels: -100,
                    maxDecibels: -10,
                    showBgColor: true,
                    bgAlpha: 0.9,
                    overlay: true,
                    reflexRatio: 0.3,
                    reflexAlpha: 0.25,
                    smoothing: 0.7,
                });
            }

            // Reset tracking data
            dbSamplesRef.current = [];
            spectrumMaxRef.current = null;
            startTimeRef.current = Date.now();
            setRealTimeData({
                currentDb: -100,
                peakDb: -100,
                avgDb: -100,
                minDb: 0,
                maxDb: -100,
            });

            // Set ref before state to ensure animation loop works immediately
            isAnalyzingRef.current = true;
            setIsAnalyzing(true);

            // Start the audio level monitoring loop
            animationRef.current = requestAnimationFrame(updateAudioLevel);
        } catch (err) {
            console.error("Error starting analysis:", err);
            const error = err as Error;
            if (error.name === "NotReadableError" || error.message === "NotReadableError") {
                setError(
                    "Microphone is busy or unavailable. Try: 1) Close other browser tabs using the mic, 2) Close and reopen your browser, 3) Check Windows Settings > Privacy > Microphone.",
                );
            } else if (error.name === "NotAllowedError") {
                setError("Microphone permission denied. Please allow microphone access in your browser settings.");
            } else if (error.name === "NotFoundError") {
                setError("No microphone found. Please connect a microphone and try again.");
            } else {
                setError(`Could not access microphone: ${error.message || "Unknown error"}`);
            }
        }
    };

    const extractTopFrequencyPeaks = useCallback((): FrequencyPeak[] => {
        if (!spectrumMaxRef.current || !audioContextRef.current) return [];

        const sampleRate = audioContextRef.current.sampleRate;
        const frequencyBinCount = spectrumMaxRef.current.length;
        const frequencyResolution = sampleRate / (frequencyBinCount * 2);

        // Create array with frequency and amplitude pairs
        const peaks: FrequencyPeak[] = [];
        for (let i = 0; i < frequencyBinCount; i++) {
            const frequency = Math.round(i * frequencyResolution);
            const amplitude = Math.round(spectrumMaxRef.current[i] * 10) / 10;
            // Only include frequencies with significant amplitude (above noise floor)
            if (amplitude > -80) {
                peaks.push({ frequency, amplitude });
            }
        }

        // Sort by amplitude (highest first) and take top 20
        peaks.sort((a, b) => b.amplitude - a.amplitude);
        return peaks.slice(0, 20);
    }, []);

    const handleFinishAnalisis = () => {
        if (!isAnalyzing) return;

        // Extract spectrum peaks before cleanup
        const spectrumPeaks = extractTopFrequencyPeaks();

        // Stop animation loop
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        // Calculate duration
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

        // Save analysis record
        const record: AnalysisRecord = {
            id: crypto.randomUUID(),
            name: analysisNameRef.current,
            date: new Date().toISOString(),
            duration,
            peakDb: realTimeData.peakDb,
            avgDb: realTimeData.avgDb,
            minDb: realTimeData.minDb,
            maxDb: realTimeData.maxDb,
            spectrumPeaks,
        };
        setHistory((prev) => [record, ...prev]);

        // Reset analysis name for next session
        setAnalysisName("");
        analysisNameRef.current = "";

        // Cleanup audiomotion-analyzer
        if (analyzerRef.current) {
            analyzerRef.current.destroy();
            analyzerRef.current = null;
        }

        // Close audio context
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Stop microphone stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        analyserNodeRef.current = null;
        isAnalyzingRef.current = false;
        setIsAnalyzing(false);
    };

    const handleDeleteRecord = (id: string) => {
        setHistory((prev) => prev.filter((record) => record.id !== id));
    };

    const handleClearHistory = () => {
        setHistory([]);
    };

    if (!isValid) return <UnauthorizedAlert />;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <AudioWaveform size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Meter
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Analyze audio input from your microphone with real-time decibel monitoring. Track current, peak,
                    average, and range dB values while viewing a live frequency spectrum visualization. All analysis
                    sessions are automatically saved for review and comparison.
                </p>
                <Button
                    onPress={onHelpOpen}
                    color="success"
                    variant="flat"
                    className="mt-4"
                    startContent={<HelpCircle size={18} />}
                >
                    How to Use
                </Button>

                <Modal isOpen={isHelpOpen} onOpenChange={onHelpOpenChange} size="3xl">
                    <ModalContent>
                        {() => (
                            <>
                                <ModalHeader className="flex items-center gap-2">
                                    <Play size={20} className="text-success" />
                                    How to Use Meter
                                </ModalHeader>
                                <ModalBody className="pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold shrink-0 text-sm">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Navigate to Meter</h4>
                                                <p className="text-sm text-default-600">
                                                    Go to the Meter page using the navigation menu.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-bold shrink-0 text-sm">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Start Analysis</h4>
                                                <p className="text-sm text-default-600">
                                                    Press "Start Analysis" to request microphone permission and begin
                                                    recording.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">While Recording</h4>
                                                <p className="text-sm text-default-600">
                                                    See live spectrum and real-time dB values updating as you capture
                                                    audio.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-danger text-white font-bold shrink-0 text-sm">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">View Results</h4>
                                                <p className="text-sm text-default-600">
                                                    Check the Analysis History table to review saved recordings and
                                                    metrics.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mb-8">
                <Button
                    color="success"
                    size="lg"
                    startContent={<Play size={20} />}
                    onPress={onStartOpen}
                    isDisabled={isAnalyzing}
                    className="font-semibold"
                >
                    Start Analisis
                </Button>
                <Button
                    color="danger"
                    size="lg"
                    startContent={<Square size={20} />}
                    onPress={onFinishOpen}
                    isDisabled={!isAnalyzing}
                    className="font-semibold"
                >
                    Finish Analisis
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-danger-100 border border-danger-300 rounded-lg text-danger-700">
                    {error}
                </div>
            )}

            {/* Spectrum Analyzer Visualization */}
            <SpectrumAnalyzer ref={containerRef} isAnalyzing={isAnalyzing} isValid={isValid ?? false} />

            {/* Real-time Values Panel */}
            <RealTimeValuesPanel data={realTimeData} isValid={isValid ?? false} />

            {/* Analysis History Table */}
            <AnalysisHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
                isValid={isValid ?? false}
            />

            {/* Start Analysis Confirmation Modal */}
            <Modal isOpen={isStartOpen} onOpenChange={onStartOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Start New Analysis</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Type the label analysis"
                                    placeholder="Enter analysis name..."
                                    variant="bordered"
                                    value={analysisName}
                                    onValueChange={setAnalysisName}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="success"
                                    onPress={() => {
                                        analysisNameRef.current =
                                            analysisName.trim() || `Analysis ${new Date().toLocaleString()}`;
                                        onClose();
                                        handleStartAnalisis();
                                    }}
                                >
                                    Start Analysis
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Finish Analysis Confirmation Modal */}
            <Modal isOpen={isFinishOpen} onOpenChange={onFinishOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Finish Analysis</ModalHeader>
                            <ModalBody>
                                <p className="text-default-600">
                                    Are you sure you want to finish the current analysis?
                                </p>
                                <p className="text-sm text-default-500">
                                    Analysis: <span className="font-semibold">{analysisNameRef.current}</span>
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        onClose();
                                        handleFinishAnalisis();
                                    }}
                                >
                                    Finish Analysis
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
