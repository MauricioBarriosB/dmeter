import { useState, useEffect, useRef } from "react";
import { FileText, Play, HelpCircle } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Divider, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { loadMaterialsHistory, saveMaterialsHistory, type MaterialsReportRecord } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import MaterialsHistoryTable from "../components/MaterialsHistoryTable";
import LicenseInvalid from "../components/LicenseInvalid";

const buildTypeOptions = [
    { key: "recording_studio", label: "Recording Studio" },
    { key: "home_studio", label: "Home Studio" },
    { key: "rehearsal_room", label: "Rehearsal Room" },
    { key: "control_room", label: "Control Room" },
    { key: "broadcast_studio", label: "Broadcast Studio" },
    { key: "podcast_room", label: "Podcast Room" },
    { key: "voiceover_booth", label: "Voiceover Booth" },
    { key: "mixing_room", label: "Mixing Room" },
    { key: "mastering_suite", label: "Mastering Suite" },
    { key: "live_room", label: "Live Room" },
    { key: "isolation_booth", label: "Isolation Booth" },
    { key: "home_theater", label: "Home Theater" },
];

const acousticTreatmentOptions = [
    { key: "acoustic_foam", label: "Acoustic Foam Panels" },
    { key: "acoustic_panels", label: "Fabric-Wrapped Acoustic Panels" },
    { key: "bass_traps", label: "Bass Traps" },
    { key: "corner_bass_traps", label: "Corner Bass Traps" },
    { key: "diffusers", label: "Diffuser Panels" },
    { key: "acoustic_curtains", label: "Acoustic Curtains" },
    { key: "acoustic_ceiling_tiles", label: "Acoustic Ceiling Tiles" },
    { key: "cloud_panels", label: "Ceiling Cloud Panels" },
    { key: "wooden_slats", label: "Wooden Slat Panels" },
    { key: "perforated_panels", label: "Perforated Wood Panels" },
    { key: "acoustic_fabric", label: "Acoustic Fabric (Guilford of Maine)" },
    { key: "isolation_pads", label: "Monitor Isolation Pads" },
    { key: "decoupling_mounts", label: "Decoupling Mounts" },
    { key: "portable_booth", label: "Portable Vocal Booth" },
    { key: "reflection_filter", label: "Microphone Reflection Filter" },
];

const insulationMaterialsOptions = [
    { key: "rockwool", label: "Rockwool / Mineral Wool Insulation" },
    { key: "fiberglass", label: "Fiberglass Insulation" },
    { key: "mass_loaded_vinyl", label: "Mass Loaded Vinyl (MLV)" },
    { key: "green_glue", label: "Green Glue Compound" },
    { key: "resilient_channels", label: "Resilient Channels" },
    { key: "soundproof_drywall", label: "Soundproof Drywall" },
    { key: "double_drywall", label: "Double Layer Drywall" },
    { key: "acoustic_caulk", label: "Acoustic Caulk / Sealant" },
    { key: "door_seals", label: "Door Seals & Sweeps" },
    { key: "soundproof_door", label: "Soundproof Studio Door" },
    { key: "carpet_underlay", label: "Carpet with Acoustic Underlay" },
    { key: "rubber_flooring", label: "Rubber Flooring" },
    { key: "floating_floor", label: "Floating Floor System" },
    { key: "suspended_ceiling", label: "Suspended Acoustic Ceiling" },
    { key: "window_plugs", label: "Window Plugs / Inserts" },
    { key: "double_glazing", label: "Double Glazed Windows" },
    { key: "studio_glass", label: "Studio Grade Glass" },
    { key: "cable_management", label: "Cable Management Systems" },
    { key: "acoustic_ventilation", label: "Acoustic Ventilation / HVAC" },
];

const allMaterialsOptions = [...acousticTreatmentOptions, ...insulationMaterialsOptions];

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
    const [history, setHistory] = useState<MaterialsReportRecord[]>([]);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [editRecord, setEditRecord] = useState<MaterialsReportRecord | null>(null);
    const historyLoaded = useRef(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        validateLicense().then(setisValid);
        loadMaterialsHistory().then((loaded) => {
            setHistory(loaded);
            historyLoaded.current = true;
        });
    }, []);

    useEffect(() => {
        if (!historyLoaded.current) return;
        saveMaterialsHistory(history);
    }, [history]);

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

    const handleSubmit = (e: React.FormEvent) => {
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
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
            setEditRecord(null);
        } else {
            setHistory((prev) => [record, ...prev]);
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
        setHistory((prev) => prev.filter((record) => record.id !== id));
        if (editRecord?.id === id) {
            setEditRecord(null);
        }
    };

    const handleClearHistory = () => {
        setHistory([]);
        setEditRecord(null);
    };

    if (isValid === null) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Validating license...</p>
            </div>
        );
    }

    if (!isValid) return <LicenseInvalid />;

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
                                                    Give your materials report a descriptive name for easy identification.
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
                                                    Choose the type of space you want to build from 12 professional options.
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
                                                    Select acoustic treatment and insulation materials from the available options.
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
                                                    Check the History table to review saved reports and edit them if needed.
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
                        <h3 className="text-lg font-semibold text-default-700">Materials Selection</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-default-500">
                                    Panels, diffusers, and sound absorption materials
                                </p>
                                <Select
                                    label="Acoustic Treatment"
                                    placeholder="Select acoustic treatment materials"
                                    selectionMode="multiple"
                                    selectedKeys={
                                        new Set(
                                            formData.selectedMaterials.filter((m) =>
                                                acousticTreatmentOptions.some((o) => o.key === m),
                                            ),
                                        )
                                    }
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys) as string[];
                                        const insulationSelected = formData.selectedMaterials.filter((m) =>
                                            insulationMaterialsOptions.some((o) => o.key === m),
                                        );
                                        handleInputChange("selectedMaterials", [...selected, ...insulationSelected]);
                                    }}
                                >
                                    {acousticTreatmentOptions.map((option) => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-default-500">
                                    Soundproofing, insulation, and construction materials
                                </p>
                                <Select
                                    label="Insulation Materials"
                                    placeholder="Select insulation materials"
                                    selectionMode="multiple"
                                    selectedKeys={
                                        new Set(
                                            formData.selectedMaterials.filter((m) =>
                                                insulationMaterialsOptions.some((o) => o.key === m),
                                            ),
                                        )
                                    }
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys) as string[];
                                        const acousticSelected = formData.selectedMaterials.filter((m) =>
                                            acousticTreatmentOptions.some((o) => o.key === m),
                                        );
                                        handleInputChange("selectedMaterials", [...acousticSelected, ...selected]);
                                    }}
                                >
                                    {insulationMaterialsOptions.map((option) => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {formData.selectedMaterials.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.selectedMaterials.map((key) => {
                                    const material = allMaterialsOptions.find((opt) => opt.key === key);
                                    return (
                                        <span
                                            key={key}
                                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                                        >
                                            {material?.label}
                                        </span>
                                    );
                                })}
                            </div>
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
