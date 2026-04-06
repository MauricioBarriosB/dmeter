import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Timer } from "lucide-react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Select,
    SelectItem,
    Divider,
    addToast,
    Slider,
} from "@heroui/react";
import HowToUse from "@components/HowToUse";
import type { TimeReportRecord } from "../types";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import { usePersistentTimeHistory } from "../hooks/usePersistentTimeHistory";
import TimeHistoryTable from "../components/TimeHistoryTable";
import ReverbTableModal from "../components/ReverbTableModal";
import DelayTableModal from "../components/DelayTableModal";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import LoadingCard from "@components/LoadingCard";
import LoadErrorCard from "@components/LoadErrorCard";
import { fetchFromApi } from "@services/apiConfig";
import { calculateReverbResults, calculateDelayResults, computeReverbDefaults, initialFormData } from "../helpers";
import type { TimeConfig, TimeFormData } from "../helpers";

const CARD_DESCRIPTIONS: Record<string, string> = {
    reverb: "Configure reverb parameters for your track. The report will calculate RT60 decay time, BPM-synced pre-delay options, early reflections, tail analysis, and a ready-to-use DAW preset with recommended EQ, wet/dry mix, and diffusion settings.",
    delay: "Configure delay parameters for your track. The report will calculate tempo-synced delay time, per-repeat amplitude decay, total tail length, and a ready-to-use DAW preset with recommended feedback, EQ filtering, and stereo spread settings.",
    default:
        "Select an effect type above to begin. Choose Reverb for space and ambience calculations, or Delay for rhythmic echo and tempo-synced repeat analysis. Each generates a detailed report with DAW-ready preset values.",
};

function CardDescription({ effectType }: Readonly<{ effectType: string }>) {
    const text = CARD_DESCRIPTIONS[effectType] || CARD_DESCRIPTIONS.default;
    return <p className="text-sm text-default-500 font-normal">{text}</p>;
}

export default function Time() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [formData, setFormData] = useState<TimeFormData>(initialFormData);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [editRecord, setEditRecord] = useState<TimeReportRecord | null>(null);
    const { history, addRecord, updateRecord, deleteRecord, clearHistory } = usePersistentTimeHistory();

    // Config from API
    const [config, setConfig] = useState<TimeConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });
        fetchFromApi<TimeConfig>("time-config")
            .then((data) => {
                setConfig(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load time config:", err);
                setLoadError("Failed to load form data. Please refresh the page.");
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const editId = searchParams.get("edit");
        if (editId && history.length > 0) {
            const record = history.find((r) => r.id === editId);
            if (record) {
                setEditRecord(record);
                setSearchParams({}, { replace: true });
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }, [searchParams, history, setSearchParams]);

    useEffect(() => {
        if (editRecord) {
            setFormData({
                reportName: editRecord.reportName,
                trackType: editRecord.trackType,
                effectType: editRecord.effectType,
                bpm: editRecord.bpm,
                timeSignature: editRecord.timeSignature ?? "4/4",
                reverbTime: editRecord.reverbTime ?? 1.5,
                preDelay: editRecord.preDelay ?? 20,
                roomSize: editRecord.roomSize ?? 50,
                environment: editRecord.environment ?? "",
                damping: editRecord.damping ?? 40,
                diffusion: editRecord.diffusion ?? 60,
                wetDryMix: editRecord.wetDryMix ?? 30,
                delayTime: editRecord.delayTime ?? 500,
                noteValue: editRecord.noteValue ?? "quarter",
                feedback: editRecord.feedback ?? 40,
                repetitions: editRecord.repetitions ?? 4,
                delayType: editRecord.delayType ?? "stereo",
                pingPongSpread: editRecord.pingPongSpread ?? 80,
                highCut: editRecord.highCut ?? 8000,
                lowCut: editRecord.lowCut ?? 200,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editRecord]);

    const handleInputChange = (field: keyof TimeFormData, value: string | number) => {
        if (!config) return;
        setFormData((prev) => {
            const next = { ...prev, [field]: value };

            if (
                !editRecord &&
                next.effectType === "reverb" &&
                ["bpm", "timeSignature", "environment", "roomSize", "damping", "effectType"].includes(field)
            ) {
                const defaults = computeReverbDefaults(
                    next.bpm,
                    next.timeSignature,
                    next.environment,
                    next.roomSize,
                    next.damping,
                    config,
                );
                next.reverbTime = defaults.reverbTime;
                next.preDelay = defaults.preDelay;
            }

            if (!editRecord && next.effectType === "delay" && ["bpm", "noteValue", "effectType"].includes(field)) {
                const noteConfig = config.noteValues.find((n) => n.key === next.noteValue);
                if (noteConfig) {
                    next.delayTime = Math.round((60000 / next.bpm) * noteConfig.multiplier);
                }
            }

            return next;
        });
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!formData.effectType || !config) return;

        const isReverb = formData.effectType === "reverb";
        const calculatedResults = isReverb
            ? calculateReverbResults(formData, config)
            : calculateDelayResults(formData, config);

        const record: TimeReportRecord = {
            id: editRecord?.id || crypto.randomUUID(),
            reportName: formData.reportName.trim() || `Report ${new Date().toLocaleString()}`,
            trackType: formData.trackType,
            trackTypeLabel: config.trackTypes.find((t) => t.key === formData.trackType)?.label || "",
            effectType: formData.effectType,
            effectTypeLabel: config.effectTypes.find((t) => t.key === formData.effectType)?.label || "",
            bpm: formData.bpm,
            timeSignature: formData.timeSignature,
            timeSignatureBeats: (
                config.timeSignatures.find((t) => t.key === formData.timeSignature) ?? config.timeSignatures[3]
            ).beats,
            timeSignatureUnit: (
                config.timeSignatures.find((t) => t.key === formData.timeSignature) ?? config.timeSignatures[3]
            ).unit,
            ...(isReverb && {
                reverbTime: formData.reverbTime,
                preDelay: formData.preDelay,
                roomSize: formData.roomSize,
                environment: formData.environment,
                environmentLabel: config.environments.find((e) => e.key === formData.environment)?.label || "",
                damping: formData.damping,
                diffusion: formData.diffusion,
                wetDryMix: formData.wetDryMix,
            }),
            ...(!isReverb && {
                delayTime: formData.delayTime,
                noteValue: formData.noteValue,
                noteValueLabel: config.noteValues.find((n) => n.key === formData.noteValue)?.label || "",
                feedback: formData.feedback,
                repetitions: formData.repetitions,
                delayType: formData.delayType,
                delayTypeLabel: config.delayTypes.find((d) => d.key === formData.delayType)?.label || "",
                pingPongSpread: formData.delayType === "pingpong" ? formData.pingPongSpread : undefined,
                highCut: formData.highCut,
                lowCut: formData.lowCut,
            }),
            calculatedResults,
            createdAt: editRecord?.createdAt || new Date().toISOString(),
        };

        if (editRecord) {
            updateRecord(record)
                .then(() =>
                    addToast({
                        title: "Report updated",
                        description: `"${record.reportName}" updated.`,
                        color: "success",
                    }),
                )
                .catch(() => addToast({ title: "Update failed", description: "Please try again.", color: "danger" }));
            setEditRecord(null);
        } else {
            addRecord(record)
                .then(() =>
                    addToast({
                        title: "Report created",
                        description: `"${record.reportName}" created.`,
                        color: "success",
                    }),
                )
                .catch(() => addToast({ title: "Creation failed", description: "Please try again.", color: "danger" }));
        }

        setFormData(initialFormData);
    };

    const handleEditRecord = (record: TimeReportRecord) => {
        setEditRecord(record);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditRecord(null);
        setFormData(initialFormData);
    };

    const handleDeleteRecord = (id: string) => {
        const record = history.find((r) => r.id === id);
        deleteRecord(id)
            .then(() =>
                addToast({
                    title: "Report deleted",
                    description: record ? `"${record.reportName}" deleted.` : "Deleted.",
                    color: "success",
                }),
            )
            .catch(() => addToast({ title: "Delete failed", description: "Please try again.", color: "danger" }));
        if (editRecord?.id === id) setEditRecord(null);
    };

    const handleClearHistory = () => {
        clearHistory()
            .then(() =>
                addToast({ title: "History cleared", description: "All time reports deleted.", color: "success" }),
            )
            .catch(() => addToast({ title: "Clear failed", description: "Please try again.", color: "danger" }));
        setEditRecord(null);
    };

    if (isValid === false) return <UnauthorizedAlert />;
    if (isLoading) return <LoadingCard maxWidth="7xl" />;
    if (loadError || !config)
        return <LoadErrorCard message={loadError || "Failed to load configuration"} maxWidth="7xl" />;

    const isReverb = formData.effectType === "reverb";
    const isDelay = formData.effectType === "delay";

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <Timer size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Time Calculator
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Professional BPM-synced calculator for reverberation and delay times. Generates precise DAW preset
                    values, tempo-locked pre-delay options, note subdivisions, and per-repeat decay analysis.
                </p>
                <div className="flex gap-3">
                    <HowToUse
                        title="How to Use Time Calculator"
                        steps={[
                            {
                                number: 1,
                                title: "Enter Report Name",
                                description: "Give your time report a descriptive name.",
                            },
                            {
                                number: 2,
                                title: "Select Track & Effect",
                                description: "Choose the track type and Reverb or Delay.",
                            },
                            {
                                number: 3,
                                title: "Set BPM, Time Signature & Parameters",
                                description: "Enter your project BPM and configure the effect.",
                            },
                            {
                                number: 4,
                                title: "Generate Report",
                                description: "Click Generate to compute all timing values.",
                            },
                            {
                                number: 5,
                                title: "View DAW Preset",
                                description: "Open the detail page for ready-to-use plugin settings.",
                            },
                        ]}
                    />
                    <ReverbTableModal />
                    <DelayTableModal />
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader className="flex flex-col items-start gap-2">
                    <h2 className="text-xl font-semibold">{editRecord ? "Edit Report" : "Create New Report"}</h2>
                    <CardDescription effectType={formData.effectType} />
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <Input
                                label="Report Name"
                                placeholder="Enter report name"
                                value={formData.reportName}
                                onValueChange={(v) => handleInputChange("reportName", v)}
                                isRequired
                            />
                            <Select
                                label="Track Type"
                                placeholder="Select track type"
                                selectedKeys={formData.trackType ? [formData.trackType] : []}
                                onSelectionChange={(k) =>
                                    handleInputChange("trackType", (Array.from(k)[0] as string) || "")
                                }
                                isRequired
                            >
                                {config.trackTypes.map((o) => (
                                    <SelectItem key={o.key}>{o.label}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Effect Type"
                                placeholder="Select effect type"
                                selectedKeys={formData.effectType ? [formData.effectType] : []}
                                onSelectionChange={(k) =>
                                    handleInputChange("effectType", (Array.from(k)[0] as string) || "")
                                }
                                isRequired
                            >
                                {config.effectTypes.map((o) => (
                                    <SelectItem key={o.key}>{o.label}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Time Signature"
                                placeholder="Select time signature"
                                selectedKeys={formData.timeSignature ? [formData.timeSignature] : []}
                                onSelectionChange={(k) =>
                                    handleInputChange("timeSignature", (Array.from(k)[0] as string) || "4/4")
                                }
                                isRequired
                            >
                                {config.timeSignatures.map((o) => (
                                    <SelectItem key={o.key}>{o.label}</SelectItem>
                                ))}
                            </Select>
                            <Input
                                type="number"
                                label="BPM (Tempo)"
                                placeholder="120"
                                value={formData.bpm.toString()}
                                onValueChange={(v) => handleInputChange("bpm", Number(v) || 120)}
                                min={20}
                                max={300}
                                isRequired
                            />
                        </div>

                        {isReverb && (
                            <>
                                <Divider />
                                <h3 className="text-lg font-semibold text-default-700">Reverb Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Select
                                        label="Environment"
                                        placeholder="Select reverb environment"
                                        selectedKeys={formData.environment ? [formData.environment] : []}
                                        onSelectionChange={(k) =>
                                            handleInputChange("environment", (Array.from(k)[0] as string) || "")
                                        }
                                        isRequired
                                    >
                                        {config.environments.map((o) => (
                                            <SelectItem key={o.key}>{o.label}</SelectItem>
                                        ))}
                                    </Select>
                                    <Input
                                        type="number"
                                        label="Reverb Time (seconds)"
                                        placeholder="1.5"
                                        value={formData.reverbTime.toString()}
                                        onValueChange={(v) => handleInputChange("reverbTime", Number(v) || 1.5)}
                                        min={0.1}
                                        max={30}
                                        step={0.1}
                                        description="Auto-calculated from BPM + environment — override to customize"
                                    />
                                    <Input
                                        type="number"
                                        label="Pre-Delay (ms)"
                                        placeholder="20"
                                        value={formData.preDelay.toString()}
                                        onValueChange={(v) => handleInputChange("preDelay", Number(v) || 0)}
                                        min={0}
                                        max={500}
                                        description="Auto-set to 1/32 note — override to customize"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Slider
                                        label="Room Size"
                                        size="sm"
                                        step={1}
                                        minValue={0}
                                        maxValue={100}
                                        value={formData.roomSize}
                                        onChange={(v) => handleInputChange("roomSize", v as number)}
                                        className="max-w-full"
                                        getValue={(v) => `${v}%`}
                                    />
                                    <Slider
                                        label="Damping"
                                        size="sm"
                                        step={1}
                                        minValue={0}
                                        maxValue={100}
                                        value={formData.damping}
                                        onChange={(v) => handleInputChange("damping", v as number)}
                                        className="max-w-full"
                                        getValue={(v) => `${v}%`}
                                    />
                                    <Slider
                                        label="Diffusion"
                                        size="sm"
                                        step={1}
                                        minValue={0}
                                        maxValue={100}
                                        value={formData.diffusion}
                                        onChange={(v) => handleInputChange("diffusion", v as number)}
                                        className="max-w-full"
                                        getValue={(v) => `${v}%`}
                                    />
                                    <Slider
                                        label="Wet/Dry Mix"
                                        size="sm"
                                        step={1}
                                        minValue={0}
                                        maxValue={100}
                                        value={formData.wetDryMix}
                                        onChange={(v) => handleInputChange("wetDryMix", v as number)}
                                        className="max-w-full"
                                        getValue={(v) => `${v}%`}
                                    />
                                </div>
                            </>
                        )}

                        {isDelay && (
                            <>
                                <Divider />
                                <h3 className="text-lg font-semibold text-default-700">Delay Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Select
                                        label="Delay Type"
                                        placeholder="Select delay type"
                                        selectedKeys={formData.delayType ? [formData.delayType] : []}
                                        onSelectionChange={(k) =>
                                            handleInputChange("delayType", (Array.from(k)[0] as string) || "")
                                        }
                                        isRequired
                                    >
                                        {config.delayTypes.map((o) => (
                                            <SelectItem key={o.key}>{o.label}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Note Value"
                                        placeholder="Select note value"
                                        selectedKeys={formData.noteValue ? [formData.noteValue] : []}
                                        onSelectionChange={(k) =>
                                            handleInputChange("noteValue", (Array.from(k)[0] as string) || "")
                                        }
                                        isRequired
                                    >
                                        {config.noteValues.map((o) => (
                                            <SelectItem key={o.key}>{o.label}</SelectItem>
                                        ))}
                                    </Select>
                                    <Input
                                        type="number"
                                        label="Delay Time (ms)"
                                        placeholder="500"
                                        value={formData.delayTime.toString()}
                                        onValueChange={(v) => handleInputChange("delayTime", Number(v) || 500)}
                                        min={1}
                                        max={5000}
                                        description="Auto-synced to note value — override to customize"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Input
                                        type="number"
                                        label="Repetitions"
                                        placeholder="4"
                                        value={formData.repetitions.toString()}
                                        onValueChange={(v) => handleInputChange("repetitions", Number(v) || 1)}
                                        min={1}
                                        max={64}
                                    />
                                    <Slider
                                        label="Feedback"
                                        size="sm"
                                        step={1}
                                        minValue={0}
                                        maxValue={100}
                                        value={formData.feedback}
                                        onChange={(v) => handleInputChange("feedback", v as number)}
                                        className="max-w-full"
                                        getValue={(v) => `${v}%`}
                                    />
                                    <Input
                                        type="number"
                                        label="High Cut (Hz)"
                                        placeholder="8000"
                                        value={formData.highCut.toString()}
                                        onValueChange={(v) => handleInputChange("highCut", Number(v) || 8000)}
                                        min={500}
                                        max={20000}
                                    />
                                    <Input
                                        type="number"
                                        label="Low Cut (Hz)"
                                        placeholder="200"
                                        value={formData.lowCut.toString()}
                                        onValueChange={(v) => handleInputChange("lowCut", Number(v) || 200)}
                                        min={20}
                                        max={2000}
                                    />
                                </div>
                                {formData.delayType === "pingpong" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Slider
                                            label="Ping Pong Spread"
                                            size="sm"
                                            step={1}
                                            minValue={0}
                                            maxValue={100}
                                            value={formData.pingPongSpread}
                                            onChange={(v) => handleInputChange("pingPongSpread", v as number)}
                                            className="max-w-full"
                                            getValue={(v) => `${v}%`}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            {editRecord && (
                                <Button
                                    type="button"
                                    color="default"
                                    variant="flat"
                                    size="lg"
                                    onPress={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                isDisabled={!formData.effectType || !formData.trackType}
                            >
                                {editRecord ? "Update Report" : "Generate Report"}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <TimeHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
                onEditRecord={handleEditRecord}
            />
        </div>
    );
}
