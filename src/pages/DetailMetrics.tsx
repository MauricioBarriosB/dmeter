import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, Waves, BarChart2, Zap, Volume2 } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, Progress } from "@heroui/react";
import type { AnalysisRecord } from "../components/AnalysisHistoryTable";
import { loadAnalysisHistory } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import { formatDate, formatDuration, formatFrequency } from "../helpers/spectrumPeaksHelper";
import UnauthorizedAlert from "../components/UnauthorizedAlert";
import {
    calculateCrestFactor,
    calculateDynamicRange,
    getLoudnessClassification,
    calculateSpectralCentroid,
    calculateSpectralRolloff,
    calculateSpectralFlatness,
    calculateBandEnergy,
    getBrightnessClassification,
} from "../helpers/advancedMetrics";

export default function DetailMetrics() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [record, setRecord] = useState<AnalysisRecord | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        validateLicense().then(setIsValid);
        if (id) {
            loadAnalysisHistory().then((history) => {
                const found = history.find((r) => r.id === id);
                if (found) {
                    setRecord(found);
                } else {
                    setNotFound(true);
                }
            });
        }
    }, [id]);

    if (!isValid) return <UnauthorizedAlert />;

    if (notFound) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/meter")}
                    className="mb-6"
                >
                    Back to Meter
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

    if (!record) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Loading metrics...</p>
            </div>
        );
    }

    // Calculate all metrics
    const crestFactor = calculateCrestFactor(record.peakDb, record.avgDb);
    const dynamicRange = calculateDynamicRange(record.maxDb, record.minDb);
    const loudness = getLoudnessClassification(record.avgDb);
    const spectralCentroid = calculateSpectralCentroid(record.spectrumPeaks || []);
    const spectralRolloff = calculateSpectralRolloff(record.spectrumPeaks || []);
    const spectralFlatness = calculateSpectralFlatness(record.spectrumPeaks || []);
    const bandEnergy = calculateBandEnergy(record.spectrumPeaks || []);
    const brightness = getBrightnessClassification(spectralCentroid);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/meter")}
                    className="mb-4"
                >
                    Back to Meter
                </Button>
                <div className="flex items-center gap-3 mb-3">
                    <Activity size={40} className="text-secondary" />
                    <div>
                        <h1
                            className="text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {record.name}
                        </h1>
                        <p className="text-lg text-default-500">Advanced Metrics</p>
                    </div>
                </div>
                <p className="text-lg text-default-600">
                    {formatDate(record.date)} • Duration: {formatDuration(record.duration)}
                </p>
            </div>

            {/* Quick Summary */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Volume2 size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold">Loudness Analysis</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-2">Classification</p>
                            <Chip color={loudness.color} size="lg" className="mb-2">
                                {loudness.label}
                            </Chip>
                            <p className="text-xs text-default-400">{loudness.description}</p>
                        </div>
                        <div className="text-center p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-2">Crest Factor</p>
                            <p className="text-3xl font-bold text-foreground">{crestFactor.toFixed(1)} dB</p>
                            <p className="text-xs text-default-400">Peak-to-average ratio</p>
                        </div>
                        <div className="text-center p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-2">Dynamic Range</p>
                            <p className="text-3xl font-bold text-foreground">{dynamicRange.toFixed(1)} dB</p>
                            <p className="text-xs text-default-400">Max-to-min difference</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Spectral Analysis */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Waves size={20} className="text-secondary" />
                        <h2 className="text-xl font-semibold">Spectral Analysis</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-default-100 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-default-500">Spectral Centroid</p>
                                <Chip color={brightness.color} size="sm">
                                    {brightness.label}
                                </Chip>
                            </div>
                            <p className="text-2xl font-bold text-foreground mb-1">
                                {formatFrequency(Math.round(spectralCentroid))}
                            </p>
                            <p className="text-xs text-default-400">
                                Center of spectral mass - indicates perceived brightness
                            </p>
                        </div>
                        <div className="p-4 bg-default-100 rounded-lg">
                            <p className="text-sm text-default-500 mb-2">Spectral Rolloff (85%)</p>
                            <p className="text-2xl font-bold text-foreground mb-1">
                                {formatFrequency(Math.round(spectralRolloff))}
                            </p>
                            <p className="text-xs text-default-400">Frequency below which 85% of energy exists</p>
                        </div>
                        <div className="p-4 bg-default-100 rounded-lg md:col-span-2">
                            <p className="text-sm text-default-500 mb-2">Spectral Flatness</p>
                            <div className="flex items-center gap-4">
                                <Progress
                                    value={spectralFlatness * 100}
                                    className="flex-1"
                                    color={spectralFlatness > 0.5 ? "warning" : "success"}
                                />
                                <span className="text-lg font-semibold w-16 text-right">
                                    {(spectralFlatness * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-default-400">Tonal (0%)</span>
                                <span className="text-xs text-default-400">Noise-like (100%)</span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Frequency Band Energy */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BarChart2 size={20} className="text-warning" />
                        <h2 className="text-xl font-semibold">Frequency Band Distribution</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Low (20-250 Hz)</span>
                                <span className="text-sm text-default-500">{bandEnergy.low.toFixed(1)}%</span>
                            </div>
                            <Progress value={bandEnergy.low} color="danger" className="h-3" />
                            <p className="text-xs text-default-400 mt-1">
                                Bass frequencies - kick drums, bass instruments
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Mid (250-4000 Hz)</span>
                                <span className="text-sm text-default-500">{bandEnergy.mid.toFixed(1)}%</span>
                            </div>
                            <Progress value={bandEnergy.mid} color="warning" className="h-3" />
                            <p className="text-xs text-default-400 mt-1">
                                Vocal range, most instruments, speech clarity
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">High (4000-20000 Hz)</span>
                                <span className="text-sm text-default-500">{bandEnergy.high.toFixed(1)}%</span>
                            </div>
                            <Progress value={bandEnergy.high} color="success" className="h-3" />
                            <p className="text-xs text-default-400 mt-1">Presence, air, cymbal shimmer, sibilance</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Technical Summary */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Zap size={20} className="text-success" />
                        <h2 className="text-xl font-semibold">Technical Summary</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Peak Level</td>
                                    <td className="py-3 font-semibold text-right">{record.peakDb} dB</td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Average Level (RMS)</td>
                                    <td className="py-3 font-semibold text-right">{record.avgDb} dB</td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Minimum Level</td>
                                    <td className="py-3 font-semibold text-right">{record.minDb} dB</td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Maximum Level</td>
                                    <td className="py-3 font-semibold text-right">{record.maxDb} dB</td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Crest Factor</td>
                                    <td className="py-3 font-semibold text-right">{crestFactor.toFixed(2)} dB</td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Dynamic Range</td>
                                    <td className="py-3 font-semibold text-right">{dynamicRange.toFixed(2)} dB</td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Spectral Centroid</td>
                                    <td className="py-3 font-semibold text-right">
                                        {formatFrequency(Math.round(spectralCentroid))}
                                    </td>
                                </tr>
                                <tr className="border-b border-default-100">
                                    <td className="py-3 text-default-500">Spectral Rolloff</td>
                                    <td className="py-3 font-semibold text-right">
                                        {formatFrequency(Math.round(spectralRolloff))}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-default-500">Spectral Flatness</td>
                                    <td className="py-3 font-semibold text-right">
                                        {(spectralFlatness * 100).toFixed(2)}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-center">
                <Button
                    color="default"
                    variant="flat"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/meter")}
                >
                    Back to Meter
                </Button>
                <Button color="default" variant="flat" onPress={() => navigate(`/analysis/${record.id}`)}>
                    View Frequency Peaks
                </Button>
            </div>
        </div>
    );
}
