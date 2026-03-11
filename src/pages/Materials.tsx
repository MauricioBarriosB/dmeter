import { useState, useEffect } from "react";
import { FileText, Play, HelpCircle } from "lucide-react";
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
import { type MaterialsReportRecord } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import { usePersistentMaterialsHistory } from "../hooks/usePersistentMaterialsHistory";
import MaterialsHistoryTable from "../components/materials/MaterialsHistoryTable";
import UnauthorizedAlert from "../components/globals/UnauthorizedAlert";
import materialsConfigJson from "../data/materialsConfig.json";

type CategoryColor = "secondary" | "danger" | "warning" | "success" | "primary" | "default";

interface MaterialOption {
    key: string;
    label: string;
}

interface MaterialCategory {
    key: string;
    label: string;
    color: CategoryColor;
    options: MaterialOption[];
}

const buildTypeOptions = materialsConfigJson.buildTypes;
const materialCategories = materialsConfigJson.categories as MaterialCategory[];
const allMaterialsOptions = materialCategories.flatMap((cat) => cat.options);

interface MaterialsFormData {
    reportName: string;
    buildType: string;
    selectedMaterials: string[];
}

const initialFormData: MaterialsFormData = {
    reportName: "",
    buildType: "",
    selectedMaterials: [],
};

export default function Materials() {
    const [formData, setFormData] = useState<MaterialsFormData>(initialFormData);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [editRecord, setEditRecord] = useState<MaterialsReportRecord | null>(null);
    const { history, addRecord, updateRecord, deleteRecord, clearHistory } = usePersistentMaterialsHistory();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        validateLicense().then(setisValid);
    }, []);

    useEffect(() => {
        if (editRecord) {
            setFormData({
                reportName: editRecord.reportName,
                buildType: editRecord.buildType,
                selectedMaterials: editRecord.selectedMaterials,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editRecord]);

    const handleInputChange = (field: keyof MaterialsFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const record: MaterialsReportRecord = {
            id: editRecord?.id || crypto.randomUUID(),
            reportName: formData.reportName.trim() || `Report ${new Date().toLocaleString()}`,
            buildType: formData.buildType,
            buildTypeLabel: buildTypeOptions.find((opt) => opt.key === formData.buildType)?.label || "",
            selectedMaterials: formData.selectedMaterials,
            selectedMaterialsLabels: formData.selectedMaterials.map(
                (key) => allMaterialsOptions.find((opt) => opt.key === key)?.label || key,
            ),
            createdAt: editRecord?.createdAt || new Date().toISOString(),
        };

        console.log("Materials Report Submitted:", record);

        if (editRecord) {
            updateRecord(record);
            setEditRecord(null);
        } else {
            addRecord(record);
        }

        setFormData(initialFormData);
    };

    const handleEditRecord = (record: MaterialsReportRecord) => {
        setEditRecord(record);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditRecord(null);
        setFormData(initialFormData);
    };

    const handleDeleteRecord = (id: string) => {
        deleteRecord(id);
        if (editRecord?.id === id) {
            setEditRecord(null);
        }
    };

    const handleClearHistory = () => {
        clearHistory();
        setEditRecord(null);
    };

    if (!isValid) return <UnauthorizedAlert />;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <FileText size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Materials Reports
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Generate comprehensive material lists for building audio studios, home studios, rehearsal rooms, and
                    professional acoustic spaces.
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
                                    How to Use Materials Reports
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
                                                    Give your materials report a descriptive name for easy
                                                    identification.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-bold shrink-0 text-sm">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Select Build Type</h4>
                                                <p className="text-sm text-default-600">
                                                    Choose the type of space you want to build from 12 professional
                                                    options.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Choose Materials</h4>
                                                <p className="text-sm text-default-600">
                                                    Select acoustic treatment and insulation materials from the
                                                    available options.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning text-white font-bold shrink-0 text-sm">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">View Results</h4>
                                                <p className="text-sm text-default-600">
                                                    Check the History table to review saved reports and edit them if
                                                    needed.
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Report Name"
                                placeholder="Enter report name"
                                value={formData.reportName}
                                onValueChange={(value) => handleInputChange("reportName", value)}
                                isRequired
                            />

                            <Select
                                label="Build Type"
                                placeholder="Select the type of space you want to build"
                                selectedKeys={formData.buildType ? [formData.buildType] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string;
                                    handleInputChange("buildType", selected || "");
                                }}
                                isRequired
                            >
                                {buildTypeOptions.map((option) => (
                                    <SelectItem key={option.key}>{option.label}</SelectItem>
                                ))}
                            </Select>
                        </div>

                        <Divider />
                        <h3 className="text-lg font-semibold text-default-700">Acoustic Treatment</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {materialCategories.slice(0, 4).map((category) => (
                                <Select
                                    key={category.key}
                                    label={category.label}
                                    placeholder={`Select ${category.label.toLowerCase()}`}
                                    selectionMode="multiple"
                                    size="sm"
                                    selectedKeys={
                                        new Set(
                                            formData.selectedMaterials.filter((m) =>
                                                category.options.some((o) => o.key === m),
                                            ),
                                        )
                                    }
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys) as string[];
                                        const otherSelected = formData.selectedMaterials.filter(
                                            (m) => !category.options.some((o) => o.key === m),
                                        );
                                        handleInputChange("selectedMaterials", [...otherSelected, ...selected]);
                                    }}
                                >
                                    {category.options.map((option) => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            ))}
                        </div>

                        <Divider />
                        <h3 className="text-lg font-semibold text-default-700">Construction & Soundproofing</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {materialCategories.slice(4, 8).map((category) => (
                                <Select
                                    key={category.key}
                                    label={category.label}
                                    placeholder={`Select ${category.label.toLowerCase()}`}
                                    selectionMode="multiple"
                                    size="sm"
                                    selectedKeys={
                                        new Set(
                                            formData.selectedMaterials.filter((m) =>
                                                category.options.some((o) => o.key === m),
                                            ),
                                        )
                                    }
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys) as string[];
                                        const otherSelected = formData.selectedMaterials.filter(
                                            (m) => !category.options.some((o) => o.key === m),
                                        );
                                        handleInputChange("selectedMaterials", [...otherSelected, ...selected]);
                                    }}
                                >
                                    {category.options.map((option) => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            ))}
                        </div>

                        {formData.selectedMaterials.length > 0 && (
                            <>
                                <Divider />
                                <h3 className="text-lg font-semibold text-default-700">Items selectons</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.selectedMaterials.map((key) => {
                                        const material = allMaterialsOptions.find((opt) => opt.key === key);
                                        const category = materialCategories.find((cat) =>
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
                                                {material?.label}
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

            <MaterialsHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
                onEditRecord={handleEditRecord}
            />
        </div>
    );
}
