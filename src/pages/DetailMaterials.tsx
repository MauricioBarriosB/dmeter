import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Hammer } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { loadMaterialsHistory, type MaterialsReportRecord } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import LicenseInvalid from "../components/LicenseInvalid";

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

interface MaterialProperties {
    category: "Acoustic Treatment" | "Insulation Materials";
    nrc: number; // Noise Reduction Coefficient (0-1)
    stc: number | null; // Sound Transmission Class
    density: string; // kg/m³ or description
    thickness: string; // typical thickness
    fireRating: string; // fire resistance class
    application: string; // primary use
}

const materialData: Record<string, MaterialProperties> = {
    // Acoustic Treatment
    acoustic_foam: {
        category: "Acoustic Treatment",
        nrc: 0.8,
        stc: null,
        density: "28-32 kg/m³",
        thickness: "25-100 mm",
        fireRating: "Class B",
        application: "Mid-high frequency absorption",
    },
    acoustic_panels: {
        category: "Acoustic Treatment",
        nrc: 0.85,
        stc: null,
        density: "48-96 kg/m³",
        thickness: "50-100 mm",
        fireRating: "Class A",
        application: "Broadband absorption",
    },
    bass_traps: {
        category: "Acoustic Treatment",
        nrc: 0.9,
        stc: null,
        density: "48-96 kg/m³",
        thickness: "100-300 mm",
        fireRating: "Class A",
        application: "Low frequency absorption",
    },
    corner_bass_traps: {
        category: "Acoustic Treatment",
        nrc: 0.95,
        stc: null,
        density: "48-96 kg/m³",
        thickness: "300-600 mm",
        fireRating: "Class A",
        application: "Corner low frequency control",
    },
    diffusers: {
        category: "Acoustic Treatment",
        nrc: 0.15,
        stc: null,
        density: "Variable",
        thickness: "50-200 mm",
        fireRating: "Class A-B",
        application: "Sound scattering/diffusion",
    },
    acoustic_curtains: {
        category: "Acoustic Treatment",
        nrc: 0.55,
        stc: 20,
        density: "300-500 g/m²",
        thickness: "3-10 mm",
        fireRating: "Class B",
        application: "Variable absorption/isolation",
    },
    acoustic_ceiling_tiles: {
        category: "Acoustic Treatment",
        nrc: 0.7,
        stc: 35,
        density: "80-150 kg/m³",
        thickness: "15-25 mm",
        fireRating: "Class A",
        application: "Ceiling absorption",
    },
    cloud_panels: {
        category: "Acoustic Treatment",
        nrc: 0.85,
        stc: null,
        density: "48-80 kg/m³",
        thickness: "50-100 mm",
        fireRating: "Class A",
        application: "Suspended ceiling absorption",
    },
    wooden_slats: {
        category: "Acoustic Treatment",
        nrc: 0.45,
        stc: null,
        density: "Variable",
        thickness: "20-40 mm",
        fireRating: "Class B-C",
        application: "Aesthetic absorption/diffusion",
    },
    perforated_panels: {
        category: "Acoustic Treatment",
        nrc: 0.65,
        stc: null,
        density: "Variable",
        thickness: "12-25 mm",
        fireRating: "Class A",
        application: "Tuned absorption",
    },
    acoustic_fabric: {
        category: "Acoustic Treatment",
        nrc: 0.1,
        stc: null,
        density: "200-400 g/m²",
        thickness: "1-3 mm",
        fireRating: "Class A",
        application: "Panel covering",
    },
    isolation_pads: {
        category: "Acoustic Treatment",
        nrc: 0.2,
        stc: null,
        density: "Variable",
        thickness: "20-50 mm",
        fireRating: "Class B",
        application: "Vibration isolation",
    },
    decoupling_mounts: {
        category: "Acoustic Treatment",
        nrc: 0.05,
        stc: null,
        density: "Variable",
        thickness: "20-80 mm",
        fireRating: "Class A",
        application: "Structural decoupling",
    },
    portable_booth: {
        category: "Acoustic Treatment",
        nrc: 0.75,
        stc: 25,
        density: "Variable",
        thickness: "50-150 mm",
        fireRating: "Class B",
        application: "Portable vocal isolation",
    },
    reflection_filter: {
        category: "Acoustic Treatment",
        nrc: 0.6,
        stc: null,
        density: "Variable",
        thickness: "100-200 mm",
        fireRating: "Class B",
        application: "Microphone reflection control",
    },
    // Insulation Materials
    rockwool: {
        category: "Insulation Materials",
        nrc: 0.95,
        stc: 45,
        density: "40-200 kg/m³",
        thickness: "50-150 mm",
        fireRating: "Class A1",
        application: "Thermal/acoustic insulation",
    },
    fiberglass: {
        category: "Insulation Materials",
        nrc: 0.9,
        stc: 42,
        density: "12-48 kg/m³",
        thickness: "50-150 mm",
        fireRating: "Class A",
        application: "Thermal/acoustic insulation",
    },
    mass_loaded_vinyl: {
        category: "Insulation Materials",
        nrc: 0.05,
        stc: 27,
        density: "4-8 kg/m²",
        thickness: "1-6 mm",
        fireRating: "Class A",
        application: "Sound barrier/mass loading",
    },
    green_glue: {
        category: "Insulation Materials",
        nrc: 0.02,
        stc: 9,
        density: "1.4 kg/L",
        thickness: "0.5-1 mm",
        fireRating: "Class A",
        application: "Damping compound",
    },
    resilient_channels: {
        category: "Insulation Materials",
        nrc: 0,
        stc: 5,
        density: "Steel",
        thickness: "13 mm",
        fireRating: "Class A",
        application: "Wall decoupling",
    },
    soundproof_drywall: {
        category: "Insulation Materials",
        nrc: 0.05,
        stc: 50,
        density: "12-15 kg/m²",
        thickness: "12-16 mm",
        fireRating: "Class A",
        application: "High-mass wall barrier",
    },
    double_drywall: {
        category: "Insulation Materials",
        nrc: 0.05,
        stc: 45,
        density: "20-25 kg/m²",
        thickness: "25-32 mm",
        fireRating: "Class A",
        application: "Mass-loaded wall system",
    },
    acoustic_caulk: {
        category: "Insulation Materials",
        nrc: 0,
        stc: null,
        density: "1.5 kg/L",
        thickness: "Variable",
        fireRating: "Class A",
        application: "Gap sealing",
    },
    door_seals: {
        category: "Insulation Materials",
        nrc: 0,
        stc: 5,
        density: "Variable",
        thickness: "10-25 mm",
        fireRating: "Class B",
        application: "Door gap sealing",
    },
    soundproof_door: {
        category: "Insulation Materials",
        nrc: 0.1,
        stc: 45,
        density: "30-50 kg/m²",
        thickness: "45-60 mm",
        fireRating: "Class A",
        application: "Sound isolation",
    },
    carpet_underlay: {
        category: "Insulation Materials",
        nrc: 0.55,
        stc: 20,
        density: "100-200 kg/m³",
        thickness: "8-12 mm",
        fireRating: "Class B",
        application: "Floor impact isolation",
    },
    rubber_flooring: {
        category: "Insulation Materials",
        nrc: 0.15,
        stc: 25,
        density: "1000-1200 kg/m³",
        thickness: "4-10 mm",
        fireRating: "Class B",
        application: "Impact/vibration isolation",
    },
    floating_floor: {
        category: "Insulation Materials",
        nrc: 0.1,
        stc: 55,
        density: "Variable",
        thickness: "50-150 mm",
        fireRating: "Class A",
        application: "Complete floor decoupling",
    },
    suspended_ceiling: {
        category: "Insulation Materials",
        nrc: 0.75,
        stc: 40,
        density: "Variable",
        thickness: "100-300 mm",
        fireRating: "Class A",
        application: "Ceiling isolation system",
    },
    window_plugs: {
        category: "Insulation Materials",
        nrc: 0.6,
        stc: 35,
        density: "Variable",
        thickness: "50-150 mm",
        fireRating: "Class B",
        application: "Window sound blocking",
    },
    double_glazing: {
        category: "Insulation Materials",
        nrc: 0.05,
        stc: 32,
        density: "25 kg/m²",
        thickness: "20-40 mm",
        fireRating: "Class A",
        application: "Window sound reduction",
    },
    studio_glass: {
        category: "Insulation Materials",
        nrc: 0.03,
        stc: 48,
        density: "40-60 kg/m²",
        thickness: "30-50 mm",
        fireRating: "Class A",
        application: "High isolation viewing",
    },
    cable_management: {
        category: "Insulation Materials",
        nrc: 0,
        stc: null,
        density: "Variable",
        thickness: "Variable",
        fireRating: "Class A",
        application: "Cable organization",
    },
    acoustic_ventilation: {
        category: "Insulation Materials",
        nrc: 0.3,
        stc: 30,
        density: "Variable",
        thickness: "200-500 mm",
        fireRating: "Class A",
        application: "Silent air circulation",
    },
};

const getNrcColor = (nrc: number): "success" | "warning" | "danger" | "default" => {
    if (nrc >= 0.7) return "success";
    if (nrc >= 0.4) return "warning";
    if (nrc > 0) return "danger";
    return "default";
};

const getStcColor = (stc: number | null): "success" | "warning" | "danger" | "default" => {
    if (stc === null) return "default";
    if (stc >= 45) return "success";
    if (stc >= 30) return "warning";
    return "danger";
};

export default function DetailMaterials() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [record, setRecord] = useState<MaterialsReportRecord | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isValid, setisValid] = useState<boolean | null>(null);

    useEffect(() => {
        validateLicense().then(setisValid);
        if (id) {
            loadMaterialsHistory().then((history) => {
                const found = history.find((r) => r.id === id);
                if (found) {
                    setRecord(found);
                } else {
                    setNotFound(true);
                }
            });
        }
    }, [id]);

    if (isValid === null) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Validating license...</p>
            </div>
        );
    }

    if (!isValid) return <LicenseInvalid />;

    if (notFound) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/materials-reports")}
                    className="mb-6"
                >
                    Back to Materials Reports
                </Button>
                <Card>
                    <CardBody>
                        <p className="text-center text-default-500 py-8">Report not found. It may have been deleted.</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Loading report...</p>
            </div>
        );
    }

    // Calculate averages
    const materialsWithData = record.selectedMaterials
        .map((key) => materialData[key])
        .filter((data) => data !== undefined);
    const avgNrc =
        materialsWithData.length > 0
            ? materialsWithData.reduce((sum, m) => sum + m.nrc, 0) / materialsWithData.length
            : 0;
    const stcValues = materialsWithData.map((m) => m.stc).filter((stc): stc is number => stc !== null);
    const avgStc = stcValues.length > 0 ? stcValues.reduce((sum, stc) => sum + stc, 0) / stcValues.length : null;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/materials-reports")}
                    className="mb-4"
                >
                    Back to Materials Reports
                </Button>
                <div className="flex items-center gap-3 mb-3">
                    <FileText size={40} className="text-primary" />
                    <div>
                        <h1
                            className="text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {record.reportName}
                        </h1>
                        <p className="text-lg text-default-500">Materials Report</p>
                    </div>
                </div>
                <p className="text-lg text-default-600">{formatDate(record.createdAt)}</p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Hammer size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold">Project Summary</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-default-500 mb-2">Build Type</p>
                            <Chip color="primary" size="lg">
                                {record.buildTypeLabel}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Total Materials</p>
                            <p className="text-2xl font-bold">{record.selectedMaterials.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Avg. NRC</p>
                            <p className="text-2xl font-bold">{avgNrc.toFixed(2)}</p>
                            <p className="text-xs text-default-400">Noise Reduction Coefficient</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Avg. STC</p>
                            <p className="text-2xl font-bold">{avgStc?.toFixed(0) ?? "N/A"}</p>
                            <p className="text-xs text-default-400">Sound Transmission Class</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Materials Acoustic Properties</h2>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">#</th>
                                    <th className="text-left p-3 font-semibold">Material</th>
                                    <th className="text-left p-3 font-semibold">Category</th>
                                    <th className="text-center p-3 font-semibold">NRC</th>
                                    <th className="text-center p-3 font-semibold">STC</th>
                                    <th className="text-left p-3 font-semibold">Density</th>
                                    <th className="text-left p-3 font-semibold">Thickness</th>
                                    <th className="text-left p-3 font-semibold">Fire Rating</th>
                                    <th className="text-left p-3 font-semibold">Application</th>
                                </tr>
                            </thead>
                            <tbody>
                                {record.selectedMaterials.map((key, index) => {
                                    const data = materialData[key];
                                    if (!data) return null;
                                    return (
                                        <tr key={key} className="border-b border-default-100 hover:bg-default-50">
                                            <td className="p-3 text-default-500">{index + 1}</td>
                                            <td className="p-3 font-medium">{record.selectedMaterialsLabels[index]}</td>
                                            <td className="p-3">
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={
                                                        data.category === "Acoustic Treatment" ? "secondary" : "primary"
                                                    }
                                                >
                                                    {data.category}
                                                </Chip>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Chip size="sm" color={getNrcColor(data.nrc)} variant="flat">
                                                    {data.nrc.toFixed(2)}
                                                </Chip>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Chip size="sm" color={getStcColor(data.stc)} variant="flat">
                                                    {data.stc ?? "N/A"}
                                                </Chip>
                                            </td>
                                            <td className="p-3 text-sm">{data.density}</td>
                                            <td className="p-3 text-sm">{data.thickness}</td>
                                            <td className="p-3 text-sm">{data.fireRating}</td>
                                            <td className="p-3 text-sm text-default-600">{data.application}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Legend</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">NRC (Noise Reduction Coefficient)</h3>
                            <p className="text-sm text-default-500 mb-2">
                                Measures sound absorption (0 = fully reflective, 1 = fully absorptive)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Chip size="sm" color="success" variant="flat">
                                    0.70+ Excellent
                                </Chip>
                                <Chip size="sm" color="warning" variant="flat">
                                    0.40-0.69 Good
                                </Chip>
                                <Chip size="sm" color="danger" variant="flat">
                                    0.01-0.39 Low
                                </Chip>
                                <Chip size="sm" color="default" variant="flat">
                                    0 Reflective
                                </Chip>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">STC (Sound Transmission Class)</h3>
                            <p className="text-sm text-default-500 mb-2">
                                Measures sound blocking ability (higher = better isolation)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Chip size="sm" color="success" variant="flat">
                                    45+ Excellent
                                </Chip>
                                <Chip size="sm" color="warning" variant="flat">
                                    30-44 Good
                                </Chip>
                                <Chip size="sm" color="danger" variant="flat">
                                    &lt;30 Basic
                                </Chip>
                                <Chip size="sm" color="default" variant="flat">
                                    N/A Not applicable
                                </Chip>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="flex gap-4 justify-center pt-4">
                <Button
                    color="default"
                    variant="flat"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/materials")}
                >
                    Back to Materials Reports
                </Button>
            </div>
        </div>
    );
}
