import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Music4,
    Volume2,
    Clock,
    Activity,
    AudioLines,
    BarChart3,
    Radio,
    Disc3,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, Progress, Divider } from "@heroui/react";
import {
    loadAudioHistory,
    loadAudioData,
    type AudioRecord,
    formatFileSize,
    formatDuration,
    formatDurationDetailed,
    getMediaLufsTargetSync,
    getMediaCategorySync,
    getGenreCategorySync,
    getGenreMasteringTargetsSync,
    isStorageValid,
} from "../helpers/audioStorage";
import { validateLicense, showUnauthorizedToast } from "../helpers/licenseValidator";
import UnauthorizedAlert from "../components/globals/UnauthorizedAlert";
import FrequencyResponseCard from "../components/globals/FrequencyResponseCard";
import {
    formatFrequency,
    formatDb,
    getFrequencyBandName,
    getLoudnessRating,
    getDynamicRangeRating,
    getSpectralBalanceAssessment,
    getStereoWidthRating,
    getCorrelationRating,
    getCrestFactorRating,
    getClippingAssessment,
    getTruePeakAssessment,
} from "../helpers/audioAnalyzer";
import LoadingCard from "../components/globals/LoadingCard";

export default function DetailAudio() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [record, setRecord] = useState<AudioRecord | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [storageValid, setStorageValid] = useState<boolean | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });
        // Load audio data for sync helper functions
        loadAudioData().then(() => setDataLoaded(true));
        // Always load history to validate storage
        loadAudioHistory().then((history) => {
            setStorageValid(isStorageValid());
            if (id) {
                const found = history.find((r) => r.id === id);
                if (found) {
                    setRecord(found);
                } else {
                    setNotFound(true);
                }
            } else {
                setNotFound(true);
            }
        });
    }, [id]);

    if (storageValid === false || isValid === false) return <UnauthorizedAlert />;

    if (isValid === null || storageValid === null) return <LoadingCard message="Loading..." maxWidth="7xl" />;

    if (notFound) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/audio")}
                    className="mb-6"
                >
                    Back to Audio
                </Button>
                <Card>
                    <CardBody>
                        <p className="text-center text-default-500 py-8">
                            Analysis not found. It may have been deleted.
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (!record || !dataLoaded) return <LoadingCard message="Loading analisys..." maxWidth="7xl" />;

    // Check for required nested properties
    if (!record.frequencyAnalysis || !record.loudnessMetrics || !record.temporalAnalysis) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/audio")}
                    className="mb-6"
                >
                    Back to Audio
                </Button>
                <Card>
                    <CardBody>
                        <p className="text-center text-default-500 py-8">
                            Invalid analysis data. The record may be corrupted.
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const { frequencyAnalysis, loudnessMetrics, temporalAnalysis } = record;
    const loudnessRating = getLoudnessRating(loudnessMetrics.lufs);
    const dynamicRangeRating = getDynamicRangeRating(loudnessMetrics.dynamicRange);
    const spectralBalance = getSpectralBalanceAssessment(frequencyAnalysis.octaveBands);
    const stereoWidthRating = getStereoWidthRating(frequencyAnalysis.stereoWidth);
    const correlationRating = getCorrelationRating(frequencyAnalysis.stereoCorrelation);
    const crestFactorRating = getCrestFactorRating(frequencyAnalysis.crestFactor);
    const clippingRating = getClippingAssessment(loudnessMetrics.clippingPercentage);
    const truePeakRating = getTruePeakAssessment(loudnessMetrics.truePeak);

    // Get target LUFS for the selected media
    const targetLufs = getMediaLufsTargetSync(record.media);
    const mediaCategory = getMediaCategorySync(record.media);
    const genreCategory = getGenreCategorySync(record.genre);
    const genreTargets = getGenreMasteringTargetsSync(record.genre);

    // Calculate deviation from target
    const lufsDeviation = targetLufs !== null ? loudnessMetrics.lufs - targetLufs : null;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/audio")}
                    className="mb-4"
                >
                    Back to Audio
                </Button>
                <div className="flex items-center gap-3 mb-3">
                    <Music4 size={40} className="text-primary" />
                    <div>
                        <h1
                            className="text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {record.reportName}
                        </h1>
                        <p className="text-lg text-default-500">Professional Audio Mastering Analysis</p>
                    </div>
                </div>
                <p className="text-lg text-default-600">{new Date(record.createdAt).toLocaleString()}</p>
            </div>

            {/* Quick Assessment Summary */}
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Quick Assessment</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-default-500 mb-1">Loudness</p>
                            <Chip color={loudnessRating.color} variant="flat" size="sm">
                                {loudnessRating.label}
                            </Chip>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-default-500 mb-1">Dynamic Range</p>
                            <Chip color={dynamicRangeRating.color} variant="flat" size="sm">
                                {dynamicRangeRating.label}
                            </Chip>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-default-500 mb-1">True Peak</p>
                            <Chip color={truePeakRating.color} variant="flat" size="sm">
                                {truePeakRating.label}
                            </Chip>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-default-500 mb-1">Clipping</p>
                            <Chip color={clippingRating.color} variant="flat" size="sm">
                                {clippingRating.label}
                            </Chip>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-default-500 mb-1">Stereo Width</p>
                            <Chip color={stereoWidthRating.color} variant="flat" size="sm">
                                {stereoWidthRating.label}
                            </Chip>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-default-500 mb-1">Spectral Balance</p>
                            <Chip color="default" variant="flat" size="sm">
                                {spectralBalance}
                            </Chip>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* File & Distribution Information */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Disc3 size={24} className="text-secondary" />
                        File & Distribution
                    </h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">File Name</p>
                            <p className="text-base font-semibold truncate" title={record.fileName}>
                                {record.fileName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">File Size</p>
                            <p className="text-base font-semibold">{formatFileSize(record.fileSize)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Genre</p>
                            <div>
                                <Chip color="primary" size="sm">
                                    {record.genreLabel}
                                </Chip>
                                <p className="text-xs text-default-400 mt-1">{genreCategory}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Distribution</p>
                            <div>
                                <Chip color="secondary" size="sm">
                                    {record.mediaLabel}
                                </Chip>
                                <p className="text-xs text-default-400 mt-1 capitalize">{mediaCategory}</p>
                            </div>
                        </div>
                    </div>
                    <Divider className="my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Duration</p>
                            <p className="text-lg font-semibold">{formatDuration(temporalAnalysis.duration)}</p>
                            <p className="text-xs text-default-400">
                                {formatDurationDetailed(temporalAnalysis.duration)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Sample Rate</p>
                            <p className="text-lg font-semibold">{temporalAnalysis.sampleRate.toLocaleString()} Hz</p>
                            <p className="text-xs text-default-400">{temporalAnalysis.sampleRateQuality}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Channels</p>
                            <p className="text-lg font-semibold">
                                {temporalAnalysis.channels === 1 ? "Mono" : "Stereo"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Total Samples</p>
                            <p className="text-lg font-semibold">{temporalAnalysis.totalSamples.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Bit Depth</p>
                            <p className="text-lg font-semibold">{temporalAnalysis.bitDepth}-bit</p>
                            <p className="text-xs text-default-400">{temporalAnalysis.bitDepthQuality}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Frequency Response Graph - Main Visual */}
            <FrequencyResponseCard
                octaveBands={frequencyAnalysis.octaveBands}
                thirdOctaveBands={frequencyAnalysis.thirdOctaveBands}
                spectrumData={frequencyAnalysis.spectrumData}
            />

            {/* Loudness Metrics - Professional */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Volume2 size={24} className="text-warning" />
                        Loudness Analysis (Professional)
                    </h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div className="p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-1">Integrated Loudness</p>
                            <p className="text-3xl font-bold">{loudnessMetrics.lufs.toFixed(1)} LUFS</p>
                            <Chip color={loudnessRating.color} size="sm" className="mt-1">
                                {loudnessRating.label}
                            </Chip>
                        </div>
                        <div className="p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-1">True Peak</p>
                            <p className="text-3xl font-bold">{formatDb(loudnessMetrics.truePeak)}TP</p>
                            <Chip color={truePeakRating.color} size="sm" className="mt-1">
                                {truePeakRating.label}
                            </Chip>
                        </div>
                        <div className="p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-1">Loudness Range</p>
                            <p className="text-3xl font-bold">{loudnessMetrics.loudnessRange.toFixed(1)} LU</p>
                            <p className="text-xs text-default-400">Dynamic variation</p>
                        </div>
                        <div className="p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-1">Dynamic Range</p>
                            <p className="text-3xl font-bold">{loudnessMetrics.dynamicRange.toFixed(1)} dB</p>
                            <Chip color={dynamicRangeRating.color} size="sm" className="mt-1">
                                {dynamicRangeRating.label}
                            </Chip>
                        </div>
                    </div>

                    {/* Target LUFS Comparison */}
                    {targetLufs !== null && (
                        <div className="mb-6 p-4 bg-default-50 rounded-lg border border-default-200">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-semibold">Target for {record.mediaLabel}</p>
                                    <p className="text-sm text-default-500">Recommended: {targetLufs} LUFS</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {lufsDeviation !== null && lufsDeviation > 0 ? "+" : ""}
                                        {lufsDeviation?.toFixed(1)} LU
                                    </p>
                                    {lufsDeviation !== null && (
                                        <Chip
                                            color={
                                                Math.abs(lufsDeviation) <= 1
                                                    ? "success"
                                                    : Math.abs(lufsDeviation) <= 3
                                                      ? "warning"
                                                      : "danger"
                                            }
                                            size="sm"
                                        >
                                            {Math.abs(lufsDeviation) <= 1
                                                ? "On Target"
                                                : lufsDeviation > 0
                                                  ? "Too Loud"
                                                  : "Too Quiet"}
                                        </Chip>
                                    )}
                                </div>
                            </div>
                            <Progress
                                value={Math.max(0, Math.min(100, ((loudnessMetrics.lufs + 24) / 24) * 100))}
                                color={Math.abs(lufsDeviation || 0) <= 1 ? "success" : "warning"}
                                className="mb-2"
                                size="sm"
                            />
                            <div className="flex justify-between text-xs text-default-400">
                                <span>-24 LUFS</span>
                                <span className="text-primary font-semibold">Target: {targetLufs} LUFS</span>
                                <span>0 LUFS</span>
                            </div>
                        </div>
                    )}

                    {/* Detailed Loudness Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Peak (L)</p>
                            <p className="text-xl font-semibold">{formatDb(loudnessMetrics.peakLeft)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Peak (R)</p>
                            <p className="text-xl font-semibold">{formatDb(loudnessMetrics.peakRight)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">RMS (L)</p>
                            <p className="text-xl font-semibold">{formatDb(loudnessMetrics.rmsLeft)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">RMS (R)</p>
                            <p className="text-xl font-semibold">{formatDb(loudnessMetrics.rmsRight)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">PSR (Crest)</p>
                            <p className="text-xl font-semibold">{loudnessMetrics.psr.toFixed(1)} dB</p>
                            <Chip color={crestFactorRating.color} size="sm" className="mt-1">
                                {crestFactorRating.label}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Headroom</p>
                            <p className="text-xl font-semibold">{loudnessMetrics.headroom.toFixed(1)} dB</p>
                        </div>
                    </div>

                    <Divider className="my-4" />

                    {/* Clipping & DC */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Clipped Samples</p>
                            <p className="text-xl font-semibold">{loudnessMetrics.clippedSamples.toLocaleString()}</p>
                            <Chip color={clippingRating.color} size="sm" className="mt-1">
                                {loudnessMetrics.clippingPercentage.toFixed(4)}%
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">DC Offset</p>
                            <p className="text-xl font-semibold">{(loudnessMetrics.dcOffset * 100).toFixed(4)}%</p>
                            <p className="text-xs text-default-400">
                                {Math.abs(loudnessMetrics.dcOffset) < 0.001 ? "Clean" : "Consider DC removal"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Short-term LUFS</p>
                            <p className="text-xl font-semibold">{loudnessMetrics.lufsShortTerm.toFixed(1)} LUFS</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Momentary LUFS</p>
                            <p className="text-xl font-semibold">{loudnessMetrics.lufsMomentary.toFixed(1)} LUFS</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Stereo Analysis */}
            {temporalAnalysis.channels > 1 && (
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Radio size={24} className="text-success" />
                            Stereo Analysis
                        </h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-default-100 rounded-lg">
                                <p className="text-sm text-default-500 mb-1">Stereo Correlation</p>
                                <p className="text-3xl font-bold">{frequencyAnalysis.stereoCorrelation.toFixed(2)}</p>
                                <Chip color={correlationRating.color} size="sm" className="mt-1">
                                    {correlationRating.label}
                                </Chip>
                            </div>
                            <div className="p-4 bg-default-100 rounded-lg">
                                <p className="text-sm text-default-500 mb-1">Stereo Width</p>
                                <p className="text-3xl font-bold">
                                    {(frequencyAnalysis.stereoWidth * 100).toFixed(0)}%
                                </p>
                                <Chip color={stereoWidthRating.color} size="sm" className="mt-1">
                                    {stereoWidthRating.label}
                                </Chip>
                            </div>
                            <div className="p-4 bg-default-100 rounded-lg">
                                <p className="text-sm text-default-500 mb-1">Phase Coherence</p>
                                <p className="text-3xl font-bold">
                                    {(frequencyAnalysis.phaseCoherence * 100).toFixed(0)}%
                                </p>
                                <p className="text-xs text-default-400">
                                    {frequencyAnalysis.phaseCoherence > 0.5 ? "Mono Compatible" : "Check Phase"}
                                </p>
                            </div>
                            <div className="p-4 bg-default-100 rounded-lg">
                                <p className="text-sm text-default-500 mb-1">L/R Balance</p>
                                <p className="text-3xl font-bold">
                                    {Math.abs(loudnessMetrics.peakLeft - loudnessMetrics.peakRight).toFixed(1)} dB
                                </p>
                                <p className="text-xs text-default-400">
                                    {loudnessMetrics.peakLeft > loudnessMetrics.peakRight
                                        ? "Left Heavy"
                                        : loudnessMetrics.peakLeft < loudnessMetrics.peakRight
                                          ? "Right Heavy"
                                          : "Centered"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Frequency Balance - Professional */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Activity size={24} className="text-success" />
                        Frequency Balance Analysis
                    </h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                        {[
                            {
                                name: "Sub Bass",
                                range: "20-60Hz",
                                energy: frequencyAnalysis.subBassEnergy,
                                color: "bg-purple-500",
                            },
                            {
                                name: "Bass",
                                range: "60-250Hz",
                                energy: frequencyAnalysis.bassEnergy,
                                color: "bg-blue-500",
                            },
                            {
                                name: "Low Mids",
                                range: "250-500Hz",
                                energy: frequencyAnalysis.lowMidEnergy,
                                color: "bg-cyan-500",
                            },
                            {
                                name: "Midrange",
                                range: "500Hz-2kHz",
                                energy: frequencyAnalysis.midEnergy,
                                color: "bg-green-500",
                            },
                            {
                                name: "Upper Mids",
                                range: "2-4kHz",
                                energy: frequencyAnalysis.upperMidEnergy,
                                color: "bg-yellow-500",
                            },
                            {
                                name: "Presence",
                                range: "4-6kHz",
                                energy: frequencyAnalysis.presenceEnergy,
                                color: "bg-orange-500",
                            },
                            {
                                name: "Brilliance",
                                range: "6-20kHz",
                                energy: frequencyAnalysis.brillianceEnergy,
                                color: "bg-red-500",
                            },
                        ].map((band) => {
                            const normalizedLevel = Math.max(0, Math.min(100, (band.energy + 60) * 1.25));
                            return (
                                <div key={band.name} className="text-center">
                                    <div className="h-24 flex items-end justify-center mb-2">
                                        <div
                                            className={`w-full rounded-t ${band.color}`}
                                            style={{ height: `${normalizedLevel}%`, minHeight: "4px" }}
                                        />
                                    </div>
                                    <p className="text-xs font-semibold">{band.name}</p>
                                    <p className="text-xs text-default-400">{band.range}</p>
                                    <p className="text-xs font-mono">{band.energy.toFixed(1)} dB</p>
                                </div>
                            );
                        })}
                    </div>

                    <Divider className="my-4" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Spectral Centroid</p>
                            <p className="text-2xl font-bold">{formatFrequency(frequencyAnalysis.spectralCentroid)}</p>
                            <p className="text-xs text-default-400">Brightness center</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Spectral Spread</p>
                            <p className="text-2xl font-bold">{formatFrequency(frequencyAnalysis.spectralSpread)}</p>
                            <p className="text-xs text-default-400">Bandwidth</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Spectral Rolloff</p>
                            <p className="text-2xl font-bold">{formatFrequency(frequencyAnalysis.spectralRolloff)}</p>
                            <p className="text-xs text-default-400">85% energy cutoff</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Spectral Flatness</p>
                            <p className="text-2xl font-bold">
                                {(frequencyAnalysis.spectralFlatness * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-default-400">
                                {frequencyAnalysis.spectralFlatness > 0.5 ? "Noise-like" : "Tonal"}
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Octave Band Analysis */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <BarChart3 size={24} className="text-secondary" />
                        Octave Band Analysis (ISO 266)
                    </h2>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Frequency</th>
                                    <th className="text-left p-3 font-semibold">Band</th>
                                    <th className="text-left p-3 font-semibold">Magnitude</th>
                                    <th className="text-left p-3 font-semibold">Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {frequencyAnalysis.octaveBands.map((band) => {
                                    const normalizedLevel = Math.max(0, Math.min(100, (band.magnitude + 80) * 1.25));
                                    return (
                                        <tr key={band.frequency} className="border-b border-default-100">
                                            <td className="p-3 font-medium">{formatFrequency(band.frequency)}</td>
                                            <td className="p-3">{getFrequencyBandName(band.frequency)}</td>
                                            <td className="p-3 font-mono">{formatDb(band.magnitude)}</td>
                                            <td className="p-3 w-1/3">
                                                <Progress
                                                    value={normalizedLevel}
                                                    color={
                                                        normalizedLevel > 70
                                                            ? "success"
                                                            : normalizedLevel > 40
                                                              ? "warning"
                                                              : "danger"
                                                    }
                                                    size="sm"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Peak Frequencies */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AudioLines size={24} className="text-primary" />
                        Peak Frequencies
                    </h2>
                </CardHeader>
                <CardBody>
                    <p className="text-sm text-default-500 mb-4">
                        Top frequencies with highest energy content. These may indicate resonances, fundamentals, or
                        problem frequencies.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {frequencyAnalysis.peakFrequencies.map((freq, index) => {
                            const chipColor = index === 0 ? "primary" : index < 3 ? "secondary" : "default";
                            const chipVariant = index === 0 ? "solid" : "flat";
                            return (
                                <Chip key={freq} color={chipColor} variant={chipVariant} size="lg">
                                    {formatFrequency(freq)} ({getFrequencyBandName(freq)})
                                </Chip>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>

            {/* Harmonic Analysis */}
            {frequencyAnalysis.harmonics.length > 0 && frequencyAnalysis.fundamentalFrequency > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Harmonic Analysis</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-default-500 mb-1">Fundamental Frequency</p>
                                <p className="text-2xl font-bold">
                                    {formatFrequency(frequencyAnalysis.fundamentalFrequency)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-default-500 mb-1">THD Estimate</p>
                                <p className="text-2xl font-bold">{frequencyAnalysis.thdEstimate.toFixed(2)}%</p>
                                <p className="text-xs text-default-400">
                                    {frequencyAnalysis.thdEstimate < 1
                                        ? "Clean"
                                        : frequencyAnalysis.thdEstimate < 5
                                          ? "Moderate"
                                          : "High"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-default-500 mb-1">Detected Harmonics</p>
                                <p className="text-2xl font-bold">{frequencyAnalysis.harmonics.length}</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-default-200">
                                        <th className="text-left p-3 font-semibold">Harmonic</th>
                                        <th className="text-left p-3 font-semibold">Frequency</th>
                                        <th className="text-left p-3 font-semibold">Magnitude</th>
                                        <th className="text-left p-3 font-semibold">Relative</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {frequencyAnalysis.harmonics.slice(0, 10).map((harmonic) => {
                                        const fundamental = frequencyAnalysis.harmonics[0]?.magnitude || -60;
                                        const relativeLevelDb = harmonic.magnitude - fundamental;
                                        return (
                                            <tr key={harmonic.order} className="border-b border-default-100">
                                                <td className="p-3">
                                                    <Chip
                                                        color={harmonic.order === 1 ? "primary" : "default"}
                                                        size="sm"
                                                        variant="flat"
                                                    >
                                                        {harmonic.order === 1
                                                            ? "Fundamental"
                                                            : `${harmonic.order}${getOrdinalSuffix(harmonic.order)}`}
                                                    </Chip>
                                                </td>
                                                <td className="p-3 font-mono">{formatFrequency(harmonic.frequency)}</td>
                                                <td className="p-3 font-mono">{formatDb(harmonic.magnitude)}</td>
                                                <td className="p-3 font-mono">
                                                    {harmonic.order === 1
                                                        ? "0.0 dB"
                                                        : `${relativeLevelDb.toFixed(1)} dB`}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Temporal Analysis */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock size={24} className="text-warning" />
                        Temporal & Transient Analysis
                    </h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Estimated BPM</p>
                            <p className="text-2xl font-bold">
                                {temporalAnalysis.estimatedBpm > 0 ? temporalAnalysis.estimatedBpm : "N/A"}
                            </p>
                            {temporalAnalysis.bpmConfidence > 0 && (
                                <p className="text-xs text-default-400">
                                    Confidence: {(temporalAnalysis.bpmConfidence * 100).toFixed(0)}%
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Transient Count</p>
                            <p className="text-2xl font-bold">{temporalAnalysis.transientCount}</p>
                            <p className="text-xs text-default-400">
                                {temporalAnalysis.transientDensity.toFixed(1)} per second
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Zero Crossing Rate</p>
                            <p className="text-2xl font-bold">
                                {(frequencyAnalysis.zeroCrossingRate * 100).toFixed(2)}%
                            </p>
                            <p className="text-xs text-default-400">
                                {frequencyAnalysis.zeroCrossingRate > 0.1 ? "Percussive" : "Sustained"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Noise Floor</p>
                            <p className="text-2xl font-bold">{formatDb(frequencyAnalysis.noiseFloor)}</p>
                        </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Leading Silence</p>
                            <p className="text-xl font-semibold">{temporalAnalysis.leadingSilence.toFixed(3)}s</p>
                            {temporalAnalysis.leadingSilence > 0.1 && (
                                <p className="text-xs text-warning">Consider trimming</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Trailing Silence</p>
                            <p className="text-xl font-semibold">{temporalAnalysis.trailingSilence.toFixed(3)}s</p>
                            {temporalAnalysis.trailingSilence > 0.5 && (
                                <p className="text-xs text-warning">Consider trimming</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Silence Percentage</p>
                            <p className="text-xl font-semibold">{temporalAnalysis.silencePercentage.toFixed(1)}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Signal-to-Noise</p>
                            <p className="text-xl font-semibold">
                                {(loudnessMetrics.peakDb - frequencyAnalysis.noiseFloor).toFixed(1)} dB
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Genre-Specific Recommendations */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Genre Mastering Targets ({record.genreLabel})</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-1">Target LUFS Range</p>
                            <p className="text-lg font-semibold">
                                {genreTargets.lufsMin} to {genreTargets.lufsMax} LUFS
                            </p>
                            <Chip
                                color={
                                    loudnessMetrics.lufs >= genreTargets.lufsMin &&
                                    loudnessMetrics.lufs <= genreTargets.lufsMax
                                        ? "success"
                                        : "warning"
                                }
                                size="sm"
                                className="mt-1"
                            >
                                {loudnessMetrics.lufs >= genreTargets.lufsMin &&
                                loudnessMetrics.lufs <= genreTargets.lufsMax
                                    ? "In Range"
                                    : "Out of Range"}
                            </Chip>
                        </div>
                        <div className="p-3 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-1">Target DR Range</p>
                            <p className="text-lg font-semibold">
                                {genreTargets.dynamicRangeMin} to {genreTargets.dynamicRangeMax} dB
                            </p>
                            <Chip
                                color={
                                    loudnessMetrics.dynamicRange >= genreTargets.dynamicRangeMin &&
                                    loudnessMetrics.dynamicRange <= genreTargets.dynamicRangeMax
                                        ? "success"
                                        : "warning"
                                }
                                size="sm"
                                className="mt-1"
                            >
                                {loudnessMetrics.dynamicRange >= genreTargets.dynamicRangeMin &&
                                loudnessMetrics.dynamicRange <= genreTargets.dynamicRangeMax
                                    ? "In Range"
                                    : "Out of Range"}
                            </Chip>
                        </div>
                        <div className="p-3 bg-default-100 rounded-lg col-span-2">
                            <p className="text-sm text-default-500 mb-1">Genre Characteristics</p>
                            <p className="text-lg font-semibold">{genreTargets.description}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Professional Recommendations */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Professional Recommendations</h2>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        {/* Critical Issues */}
                        {(loudnessMetrics.clippingPercentage > 0.01 ||
                            loudnessMetrics.truePeak > -0.3 ||
                            Math.abs(loudnessMetrics.dcOffset) > 0.01) && (
                            <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle size={20} className="text-danger" />
                                    <h3 className="font-semibold text-danger">Critical Issues</h3>
                                </div>
                                <ul className="space-y-1 text-sm">
                                    {loudnessMetrics.clippingPercentage > 0.01 && (
                                        <li>
                                            Clipping detected ({loudnessMetrics.clippingPercentage.toFixed(4)}%). Reduce
                                            gain to prevent distortion.
                                        </li>
                                    )}
                                    {loudnessMetrics.truePeak > -0.3 && (
                                        <li>
                                            True peak too high ({formatDb(loudnessMetrics.truePeak)}TP). Target -1dBTP
                                            or lower for streaming.
                                        </li>
                                    )}
                                    {Math.abs(loudnessMetrics.dcOffset) > 0.01 && (
                                        <li>
                                            DC offset detected ({(loudnessMetrics.dcOffset * 100).toFixed(2)}%). Apply
                                            high-pass filter.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Loudness Recommendations */}
                        <div className="bg-default-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Volume2 size={20} className="text-warning" />
                                <h3 className="font-semibold">Loudness</h3>
                            </div>
                            <ul className="space-y-1 text-sm">
                                {targetLufs !== null && lufsDeviation !== null && Math.abs(lufsDeviation) > 2 && (
                                    <li>
                                        {lufsDeviation > 0
                                            ? `Reduce loudness by ~${lufsDeviation.toFixed(1)} LU to meet ${record.mediaLabel} target of ${targetLufs} LUFS.`
                                            : `Increase loudness by ~${Math.abs(lufsDeviation).toFixed(1)} LU to meet ${record.mediaLabel} target of ${targetLufs} LUFS.`}
                                    </li>
                                )}
                                {loudnessMetrics.lufs < genreTargets.lufsMin && (
                                    <li>
                                        Audio is quieter than typical {record.genreLabel} masters. Consider increasing
                                        to {genreTargets.lufsMin} LUFS.
                                    </li>
                                )}
                                {loudnessMetrics.lufs > genreTargets.lufsMax && (
                                    <li>
                                        Audio is louder than typical {record.genreLabel} masters. Consider reducing to{" "}
                                        {genreTargets.lufsMax} LUFS.
                                    </li>
                                )}
                                {loudnessMetrics.dynamicRange < genreTargets.dynamicRangeMin && (
                                    <li>Dynamic range is compressed for this genre. Consider using less limiting.</li>
                                )}
                            </ul>
                        </div>

                        {/* Stereo Recommendations */}
                        {temporalAnalysis.channels > 1 && (
                            <div className="bg-default-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Radio size={20} className="text-success" />
                                    <h3 className="font-semibold">Stereo Image</h3>
                                </div>
                                <ul className="space-y-1 text-sm">
                                    {frequencyAnalysis.stereoCorrelation < 0.3 && (
                                        <li>
                                            Low stereo correlation may cause mono compatibility issues. Check phase
                                            relationships.
                                        </li>
                                    )}
                                    {frequencyAnalysis.stereoWidth > 1.2 && (
                                        <li>Very wide stereo image. May collapse or phase when summed to mono.</li>
                                    )}
                                    {Math.abs(loudnessMetrics.peakLeft - loudnessMetrics.peakRight) > 3 && (
                                        <li>Significant L/R imbalance detected. Check panning and balance.</li>
                                    )}
                                    {frequencyAnalysis.stereoCorrelation > 0.9 &&
                                        frequencyAnalysis.stereoWidth < 0.3 && (
                                            <li>
                                                Nearly mono signal. Consider adding stereo width if appropriate for the
                                                genre.
                                            </li>
                                        )}
                                </ul>
                            </div>
                        )}

                        {/* Frequency Recommendations */}
                        <div className="bg-default-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={20} className="text-primary" />
                                <h3 className="font-semibold">Frequency Balance</h3>
                            </div>
                            <ul className="space-y-1 text-sm">
                                {spectralBalance === "Bass Heavy" && (
                                    <li>
                                        Bass-heavy mix detected. Consider high-pass filter or reducing low frequencies.
                                    </li>
                                )}
                                {spectralBalance === "Bright" && (
                                    <li>Bright mix. Check for harshness in 2-6kHz range.</li>
                                )}
                                {spectralBalance === "Thin" && (
                                    <li>Lacking low-end presence. Consider adding warmth in the bass region.</li>
                                )}
                                {frequencyAnalysis.subBassEnergy > -20 && record.media === "vinyl_12" && (
                                    <li>
                                        Strong sub-bass content. For vinyl, ensure bass is centered and consider
                                        high-pass at 30Hz.
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* All Good */}
                        {loudnessMetrics.clippingPercentage <= 0.01 &&
                            loudnessMetrics.truePeak <= -0.3 &&
                            Math.abs(loudnessMetrics.dcOffset) <= 0.01 &&
                            (targetLufs === null || Math.abs(lufsDeviation || 0) <= 2) &&
                            frequencyAnalysis.stereoCorrelation >= 0.3 && (
                                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={20} className="text-success" />
                                        <h3 className="font-semibold text-success">Audio Quality Assessment</h3>
                                    </div>
                                    <p className="text-sm mt-2">
                                        This audio meets professional mastering standards for {record.mediaLabel}{" "}
                                        distribution. No critical issues detected.
                                    </p>
                                </div>
                            )}
                    </div>
                </CardBody>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-center pt-4">
                <Button
                    color="default"
                    variant="flat"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/audio")}
                >
                    Back to Audio
                </Button>
            </div>
        </div>
    );
}

// Helper function for ordinal suffixes
function getOrdinalSuffix(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
