import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Drum } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Divider, addToast } from "@heroui/react";
import HowToUse from "@components/HowToUse";
import type { InstrumentsReportRecord } from "../types";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import { usePersistentInstrumentsHistory } from "../hooks/usePersistentInstrumentsHistory";
import InstrumentsHistoryTable from "../components/IntrumentsHistoryTable";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import LoadErrorCard from "@components/LoadErrorCard";
import LoadingCard from "@components/LoadingCard";
import { fetchFromApi } from "@services/apiConfig";

type CategoryColor = "secondary" | "danger" | "warning" | "success" | "primary" | "default";

interface InstrumentOption {
    key: string;
    label: string;
}

interface InstrumentCategory {
    key: string;
    label: string;
    color: CategoryColor;
    options: InstrumentOption[];
}

interface InstrumentsConfig {
    ensembleTypes: InstrumentOption[];
    genreTypes: InstrumentOption[];
    categories: InstrumentCategory[];
}

interface InstrumentsFormData {
    reportName: string;
    ensembleType: string;
    genre: string;
    selectedInstruments: string[];
}

const initialFormData: InstrumentsFormData = {
    reportName: "",
    ensembleType: "",
    genre: "",
    selectedInstruments: [],
};

export default function Instruments() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [formData, setFormData] = useState<InstrumentsFormData>(initialFormData);
    const [editRecord, setEditRecord] = useState<InstrumentsReportRecord | null>(null);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const { history, addRecord, updateRecord, deleteRecord, clearHistory } = usePersistentInstrumentsHistory();

    // Config data from API
    const [config, setConfig] = useState<InstrumentsConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });
        fetchFromApi<InstrumentsConfig>("instruments-config")
            .then((data) => {
                setConfig(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load instruments config:", err);
                setLoadError("Failed to load form data. Please refresh the page.");
                setIsLoading(false);
            });
    }, []);

    // Handle edit from URL query parameter (from dashboard)
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
                ensembleType: editRecord.ensembleType,
                genre: editRecord.genre,
                selectedInstruments: editRecord.selectedInstruments,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editRecord]);

    const handleInputChange = (field: keyof InstrumentsFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!config) return;

        const allInstrumentOptions = config.categories.flatMap((cat) => cat.options);

        const record: InstrumentsReportRecord = {
            id: editRecord?.id || crypto.randomUUID(),
            reportName: formData.reportName.trim() || `Report ${new Date().toLocaleString()}`,
            ensembleType: formData.ensembleType,
            ensembleTypeLabel: config.ensembleTypes.find((opt) => opt.key === formData.ensembleType)?.label || "",
            genre: formData.genre,
            genreLabel: config.genreTypes.find((opt) => opt.key === formData.genre)?.label || "",
            selectedInstruments: formData.selectedInstruments,
            selectedInstrumentsLabels: formData.selectedInstruments.map(
                (key) => allInstrumentOptions.find((opt) => opt.key === key)?.label || key,
            ),
            createdAt: editRecord?.createdAt || new Date().toISOString(),
        };

        if (editRecord) {
            updateRecord(record)
                .then(() => {
                    addToast({
                        title: "Report updated",
                        description: `"${record.reportName}" has been updated successfully.`,
                        color: "success",
                    });
                })
                .catch((err) => {
                    console.error("Failed to update record:", err);
                    addToast({
                        title: "Update failed",
                        description: "Failed to update the report. Please try again.",
                        color: "danger",
                    });
                });
            setEditRecord(null);
        } else {
            addRecord(record)
                .then(() => {
                    addToast({
                        title: "Report created",
                        description: `"${record.reportName}" has been created successfully.`,
                        color: "success",
                    });
                })
                .catch((err) => {
                    console.error("Failed to add record:", err);
                    addToast({
                        title: "Creation failed",
                        description: "Failed to create the report. Please try again.",
                        color: "danger",
                    });
                });
        }

        setFormData(initialFormData);
    };

    const handleEditRecord = (record: InstrumentsReportRecord) => {
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
            .then(() => {
                addToast({
                    title: "Report deleted",
                    description: record ? `"${record.reportName}" has been deleted.` : "Report has been deleted.",
                    color: "success",
                });
            })
            .catch((err) => {
                console.error("Failed to delete record:", err);
                addToast({
                    title: "Delete failed",
                    description: "Failed to delete the report. Please try again.",
                    color: "danger",
                });
            });
        if (editRecord?.id === id) {
            setEditRecord(null);
        }
    };

    const handleClearHistory = () => {
        clearHistory()
            .then(() => {
                addToast({
                    title: "History cleared",
                    description: "All instruments reports have been deleted.",
                    color: "success",
                });
            })
            .catch((err) => {
                console.error("Failed to clear history:", err);
                addToast({
                    title: "Clear failed",
                    description: "Failed to clear history. Please try again.",
                    color: "danger",
                });
            });
        setEditRecord(null);
    };

    if (isValid === false) return <UnauthorizedAlert />;

    if (isLoading) return <LoadingCard maxWidth="7xl" />;

    if (loadError || !config)
        return <LoadErrorCard message={loadError || "Failed to load configuration"} maxWidth="7xl" />;

    const allInstrumentOptions = config.categories.flatMap((cat) => cat.options);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <Drum size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Instruments Reports
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Generate comprehensive instrument lists for musical ensembles, bands, and orchestras. Select your
                    ensemble type, genre, and choose from a wide variety of instruments.
                </p>
                <HowToUse
                    title="How to Use Instruments Reports"
                    steps={[
                        {
                            number: 1,
                            title: "Enter Report Name",
                            description: "Give your instruments report a descriptive name for easy identification.",
                        },
                        {
                            number: 2,
                            title: "Select Ensemble & Genre",
                            description: "Choose your ensemble type and musical genre to categorize your report.",
                        },
                        {
                            number: 3,
                            title: "Choose Instruments",
                            description:
                                "Select instruments from various categories: strings, woodwinds, brass, percussion, keyboards, and electronic.",
                        },
                        {
                            number: 4,
                            title: "Generate Report",
                            description: "Submit your selections to generate a comprehensive instruments report.",
                        },
                        {
                            number: 5,
                            title: "View Results",
                            description: "Check the History table to review saved reports and edit them if needed.",
                        },
                    ]}
                />
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">{editRecord ? "Edit Report" : "Create New Report"}</h2>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Report Name"
                                placeholder="Enter report name"
                                value={formData.reportName}
                                onValueChange={(value) => handleInputChange("reportName", value)}
                                isRequired
                            />

                            <Select
                                label="Ensemble Type"
                                placeholder="Select ensemble type"
                                selectedKeys={formData.ensembleType ? [formData.ensembleType] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string;
                                    handleInputChange("ensembleType", selected || "");
                                }}
                                isRequired
                            >
                                {config.ensembleTypes.map((option) => (
                                    <SelectItem key={option.key}>{option.label}</SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="Genre"
                                placeholder="Select musical genre"
                                selectedKeys={formData.genre ? [formData.genre] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string;
                                    handleInputChange("genre", selected || "");
                                }}
                                isRequired
                            >
                                {config.genreTypes.map((option) => (
                                    <SelectItem key={option.key}>{option.label}</SelectItem>
                                ))}
                            </Select>
                        </div>

                        <Divider />
                        <h3 className="text-lg font-semibold text-default-700">Musical Instruments</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {config.categories.map((category) => (
                                <Select
                                    key={category.key}
                                    label={category.label}
                                    placeholder={`Select ${category.label.toLowerCase()}`}
                                    selectionMode="multiple"
                                    size="sm"
                                    selectedKeys={
                                        new Set(
                                            formData.selectedInstruments.filter((m) =>
                                                category.options.some((o) => o.key === m),
                                            ),
                                        )
                                    }
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys) as string[];
                                        const otherSelected = formData.selectedInstruments.filter(
                                            (m) => !category.options.some((o) => o.key === m),
                                        );
                                        handleInputChange("selectedInstruments", [...otherSelected, ...selected]);
                                    }}
                                >
                                    {category.options.map((option) => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            ))}
                        </div>

                        {formData.selectedInstruments.length > 0 && (
                            <>
                                <Divider />
                                <h3 className="text-lg font-semibold text-default-700">Selected Instruments</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.selectedInstruments.map((key) => {
                                        const instrument = allInstrumentOptions.find((opt) => opt.key === key);
                                        const category = config.categories.find((cat) =>
                                            cat.options.some((o) => o.key === key),
                                        );
                                        const colorClasses: Record<string, string> = {
                                            primary: "bg-primary/10 text-primary",
                                            secondary: "bg-secondary/10 text-secondary",
                                            success: "bg-success/10 text-success",
                                            warning: "bg-warning/10 text-warning",
                                            danger: "bg-danger/10 text-danger",
                                            default: "bg-default/10 text-default-600",
                                        };
                                        const colorClass = colorClasses[category?.color ?? "default"];
                                        return (
                                            <span key={key} className={`px-3 py-1 text-sm rounded-full ${colorClass}`}>
                                                {instrument?.label}
                                            </span>
                                        );
                                    })}
                                </div>
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
                            <Button type="submit" color="primary" size="lg">
                                {editRecord ? "Update Report" : "Generate Report"}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <InstrumentsHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
                onEditRecord={handleEditRecord}
            />
        </div>
    );
}
