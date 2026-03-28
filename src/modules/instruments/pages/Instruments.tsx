import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Drum, Play, HelpCircle } from "lucide-react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Select,
    SelectItem,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/react";
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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            updateRecord(record).catch((err) => console.error("Failed to update record:", err));
            setEditRecord(null);
        } else {
            addRecord(record).catch((err) => console.error("Failed to add record:", err));
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
        deleteRecord(id).catch((err) => console.error("Failed to delete record:", err));
        if (editRecord?.id === id) {
            setEditRecord(null);
        }
    };

    const handleClearHistory = () => {
        clearHistory().catch((err) => console.error("Failed to clear history:", err));
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
                <Button
                    onPress={onOpen}
                    color="success"
                    variant="flat"
                    className="mt-4"
                    startContent={<HelpCircle size={18} />}
                >
                    How to Use
                </Button>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
                    <ModalContent>
                        {() => (
                            <>
                                <ModalHeader className="flex items-center gap-2">
                                    <Play size={20} className="text-success" />
                                    How to Use Instruments Reports
                                </ModalHeader>
                                <ModalBody className="pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold shrink-0 text-sm">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Enter Report Name</h4>
                                                <p className="text-sm text-default-600">
                                                    Give your instruments report a descriptive name for easy
                                                    identification.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-bold shrink-0 text-sm">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Select Ensemble & Genre</h4>
                                                <p className="text-sm text-default-600">
                                                    Choose your ensemble type and musical genre to categorize your
                                                    report.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Choose Instruments</h4>
                                                <p className="text-sm text-default-600">
                                                    Select instruments from various categories: strings, woodwinds,
                                                    brass, percussion, keyboards, and electronic.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning text-white font-bold shrink-0 text-sm">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Generate Report</h4>
                                                <p className="text-sm text-default-600">
                                                    Submit your selections to generate a comprehensive instruments
                                                    report.
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
