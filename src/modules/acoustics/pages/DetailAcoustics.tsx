import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Waves } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, Progress, Divider } from "@heroui/react";
import { fetchAcousticsReport } from "@services/apiCrud";
import type { AcousticsRecord, AcousticMetrics, AcousticsConfig } from "../types";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import { fetchFromApi } from "@services/apiConfig";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import {
    FREQ_BANDS,
    calculateAcousticMetrics,
    formatDate,
    getBassRatioLabel,
    getStiLabel,
    getStiColor,
    getC50Label,
    getC50Color,
    getC80Label,
    getC80Color,
    getRT60StatusLabel,
    getRT60StatusColor,
    getPurposeLabel,
    getRoofLabel,
    getMaterialLabel,
} from "../helpers/acousticsHelper";
import LoadingCard from "@components/LoadingCard";
import LoadErrorCard from "@components/LoadErrorCard";

export default function DetailAcoustics() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [record, setRecord] = useState<AcousticsRecord | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [metrics, setMetrics] = useState<AcousticMetrics | null>(null);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [config, setConfig] = useState<AcousticsConfig | null>(null);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });

        if (!id) {
            setNotFound(true);
            return;
        }

        // Load config and report in parallel
        Promise.all([fetchFromApi<AcousticsConfig>("acoustics-config"), fetchAcousticsReport(id)])
            .then(([configData, reportData]) => {
                setConfig(configData);
                setRecord(reportData);
                setMetrics(calculateAcousticMetrics(reportData, configData));
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
                if (err.message?.includes("not found") || err.message?.includes("404")) {
                    setNotFound(true);
                } else {
                    setLoadError("Failed to load analysis data. Please refresh the page.");
                }
            });
    }, [id]);

    if (isValid === false) return <UnauthorizedAlert />;

    if (loadError) return <LoadErrorCard message={loadError} maxWidth="7xl" />;

    if (isValid === null || !config) return <LoadingCard message="Loading..." maxWidth="7xl" />;

    if (notFound) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/acoustics")}
                    className="mb-6"
                >
                    Back to Acoustics
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

    if (!record || !metrics) return <LoadingCard message="Loading analisys..." maxWidth="7xl" />;

    const rt60Progress = Math.min((metrics.rt60Mid / metrics.optimalRT60Range.max) * 100, 150);
    const rt60Color = getRT60StatusColor(metrics.rt60Status);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex gap-2 mb-4">
                    <Button
                        variant="light"
                        startContent={<ArrowLeft size={20} />}
                        onPress={() => navigate("/acoustics")}
                    >
                        Back to Acoustics
                    </Button>
                    <Button
                        color="primary"
                        variant="flat"
                        startContent={<Pencil size={18} />}
                        onPress={() => navigate(`/acoustics?edit=${id}`)}
                    >
                        Edit Report
                    </Button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <Waves size={40} className="text-primary" />
                    <div>
                        <h1
                            className="text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {record.analysisName}
                        </h1>
                        <p className="text-lg text-default-500">Professional Acoustic Analysis Report</p>
                    </div>
                </div>
                <p className="text-lg text-default-600">{formatDate(record.date)}</p>
            </div>

            {/* Room Configuration */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Room Configuration</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Dimensions (H×W×D)</p>
                            <p className="text-lg font-semibold">
                                {record.roomHeight}×{record.roomWidth}×{record.roomDepth} m
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Volume</p>
                            <p className="text-lg font-semibold">{metrics.volume.toFixed(1)} m³</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Surface Area</p>
                            <p className="text-lg font-semibold">{metrics.surfaceArea.toFixed(1)} m²</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Speed of Sound</p>
                            <p className="text-lg font-semibold">{metrics.speedOfSound.toFixed(1)} m/s</p>
                        </div>
                    </div>
                    <Divider className="my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Purpose</p>
                            <Chip color="primary" size="sm">
                                {getPurposeLabel(config, record.roomPurpose)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Ceiling</p>
                            <Chip color="secondary" size="sm">
                                {getRoofLabel(config, record.roofType)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Temperature</p>
                            <p className="text-lg font-semibold">{record.temperature}°C</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Humidity</p>
                            <p className="text-lg font-semibold">{record.humidity}%</p>
                        </div>
                    </div>
                    <Divider className="my-4" />
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Floor Material</p>
                            <Chip size="sm" variant="flat">
                                {getMaterialLabel(config, record.floorMaterial)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Ceiling Material</p>
                            <Chip size="sm" variant="flat">
                                {getMaterialLabel(config, record.ceilingMaterial)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Wall Material</p>
                            <Chip size="sm" variant="flat">
                                {getMaterialLabel(config, record.wallMaterial)}
                            </Chip>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Reverberation Time */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Reverberation Time (RT60)</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Mid-Frequency RT60</p>
                            <p className="text-3xl font-bold">{metrics.rt60Mid.toFixed(2)} s</p>
                            <p className="text-xs text-default-400">Average of 500Hz & 1kHz</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">EDT (Early Decay Time)</p>
                            <p className="text-3xl font-bold">{metrics.edt.toFixed(2)} s</p>
                            <p className="text-xs text-default-400">Perceptually relevant</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Bass Ratio</p>
                            <p className="text-3xl font-bold">{metrics.bassRatio.toFixed(2)}</p>
                            <p className="text-xs text-default-400">{getBassRatioLabel(metrics.bassRatio)}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-default-500">
                                RT60 vs Optimal Range for {getPurposeLabel(config, record.roomPurpose)}
                            </span>
                            <Chip color={rt60Color} size="sm">
                                {getRT60StatusLabel(metrics.rt60Status)}
                            </Chip>
                        </div>
                        <Progress value={rt60Progress} color={rt60Color} className="mb-2" size="sm" />
                        <div className="flex justify-between text-xs text-default-400">
                            <span>0s</span>
                            <span>
                                Optimal: {metrics.optimalRT60Range.min}s - {metrics.optimalRT60Range.max}s (ideal:{" "}
                                {metrics.optimalRT60Range.ideal}s)
                            </span>
                            <span>{(metrics.optimalRT60Range.max * 1.5).toFixed(1)}s</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Frequency-Dependent RT60 */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Frequency-Dependent Analysis</h2>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Frequency</th>
                                    <th className="text-left p-3 font-semibold">RT60 (Sabine)</th>
                                    <th className="text-left p-3 font-semibold">RT60 (Eyring)</th>
                                    <th className="text-left p-3 font-semibold">Absorption (m²)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FREQ_BANDS.map((freq) => (
                                    <tr key={freq} className="border-b border-default-100">
                                        <td className="p-3 font-medium">{freq} Hz</td>
                                        <td className="p-3">
                                            {metrics.frequencyMetrics[freq].rt60Sabine.toFixed(2)} s
                                        </td>
                                        <td className="p-3">
                                            {metrics.frequencyMetrics[freq].rt60Eyring.toFixed(2)} s
                                        </td>
                                        <td className="p-3">
                                            {metrics.frequencyMetrics[freq].totalAbsorption.toFixed(1)} m²
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Speech Intelligibility & Clarity */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Speech Intelligibility & Clarity</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-default-500 mb-1">STI (Estimated)</p>
                            <p className="text-2xl font-bold">{metrics.stiEstimate.toFixed(2)}</p>
                            <Chip color={getStiColor(metrics.stiEstimate)} size="sm">
                                {getStiLabel(metrics.stiEstimate)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">C50 (Speech Clarity)</p>
                            <p className="text-2xl font-bold">{metrics.c50.toFixed(1)} dB</p>
                            <Chip color={getC50Color(metrics.c50)} size="sm">
                                {getC50Label(metrics.c50)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">C80 (Music Clarity)</p>
                            <p className="text-2xl font-bold">{metrics.c80.toFixed(1)} dB</p>
                            <Chip color={getC80Color(metrics.c80)} size="sm">
                                {getC80Label(metrics.c80)}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">D50 (Definition)</p>
                            <p className="text-2xl font-bold">{metrics.d50.toFixed(0)}%</p>
                            <Chip color={metrics.d50 >= 50 ? "success" : "warning"} size="sm">
                                {metrics.d50 >= 50 ? "Good" : "Needs Improvement"}
                            </Chip>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Advanced Parameters */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Advanced Acoustic Parameters</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-default-500 mb-1">Mean Free Path</p>
                            <p className="text-2xl font-semibold">{metrics.meanFreePath.toFixed(2)} m</p>
                            <p className="text-xs text-default-400">Avg. distance between reflections</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Critical Distance</p>
                            <p className="text-2xl font-semibold">{metrics.criticalDistance.toFixed(2)} m</p>
                            <p className="text-xs text-default-400">Direct = Reverberant sound</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-1">Schroeder Frequency</p>
                            <p className="text-2xl font-semibold">{metrics.schroederFrequency.toFixed(0)} Hz</p>
                            <p className="text-xs text-default-400">Modal → Diffuse transition</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Room Modes */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Room Modes (Axial)</h2>
                </CardHeader>
                <CardBody>
                    <p className="text-sm text-default-500 mb-4">
                        Modes below {metrics.schroederFrequency.toFixed(0)} Hz are in the modal region and may cause
                        uneven bass response.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Frequency</th>
                                    <th className="text-left p-3 font-semibold">Mode Type</th>
                                    <th className="text-left p-3 font-semibold">Indices</th>
                                    <th className="text-left p-3 font-semibold">Region</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.roomModes.map((mode, i) => (
                                    <tr key={i} className="border-b border-default-100">
                                        <td className="p-3 font-medium">{mode.frequency} Hz</td>
                                        <td className="p-3">{mode.type}</td>
                                        <td className="p-3 font-mono">{mode.indices}</td>
                                        <td className="p-3">
                                            <Chip
                                                color={
                                                    mode.frequency < metrics.schroederFrequency ? "warning" : "success"
                                                }
                                                size="sm"
                                                variant="flat"
                                            >
                                                {mode.frequency < metrics.schroederFrequency ? "Modal" : "Diffuse"}
                                            </Chip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Recommendations */}
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Recommendations</h2>
                </CardHeader>
                <CardBody>
                    <div className="bg-default-100 rounded-lg p-4">
                        <ul className="space-y-2 text-sm">
                            {metrics.rt60Status === "too_reverberant" && (
                                <li>
                                    • <strong>Reduce RT60:</strong> Add absorption (acoustic panels, heavy curtains,
                                    carpet) to reduce reverberation.
                                </li>
                            )}
                            {metrics.rt60Status === "too_dry" && (
                                <li>
                                    • <strong>Increase RT60:</strong> Reduce absorption or add reflective surfaces for
                                    more liveliness.
                                </li>
                            )}
                            {metrics.stiEstimate < 0.6 && (
                                <li>
                                    • <strong>Improve Speech Intelligibility:</strong> Consider adding absorption to
                                    reduce RT60 and improve clarity.
                                </li>
                            )}
                            {metrics.bassRatio > 1.3 && (
                                <li>
                                    • <strong>Bass Buildup:</strong> Add bass traps in corners to control low-frequency
                                    accumulation.
                                </li>
                            )}
                            {metrics.bassRatio < 0.8 && (
                                <li>
                                    • <strong>Lacking Warmth:</strong> Reduce low-frequency absorption or add resonant
                                    absorbers tuned to mid frequencies.
                                </li>
                            )}
                            {metrics.roomModes.filter((m) => m.frequency < metrics.schroederFrequency).length > 5 && (
                                <li>
                                    • <strong>Modal Issues:</strong> Consider bass traps and diffusers to address room
                                    modes below {metrics.schroederFrequency.toFixed(0)} Hz.
                                </li>
                            )}
                            {metrics.rt60Status === "optimal" && metrics.stiEstimate >= 0.6 && (
                                <li>
                                    • <strong>Good acoustic balance:</strong> The room is well-suited for its intended
                                    purpose.
                                </li>
                            )}
                        </ul>
                    </div>
                </CardBody>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-center pt-4">
                <Button
                    color="default"
                    variant="flat"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/acoustics")}
                >
                    Back to Acoustics
                </Button>
                <Button
                    color="primary"
                    variant="flat"
                    startContent={<Pencil size={18} />}
                    onPress={() => navigate(`/acoustics?edit=${id}`)}
                >
                    Edit Report
                </Button>
            </div>
        </div>
    );
}
