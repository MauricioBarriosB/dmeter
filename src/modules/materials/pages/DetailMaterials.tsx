import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Container, Hammer } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, Spinner } from "@heroui/react";
import { fetchMaterialsReport } from "@services/apiCrud";
import type { MaterialsReportRecord } from "../types";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import LoadErrorCard from "@components/LoadErrorCard";
import { fetchFromApi } from "@services/apiConfig";

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

type MaterialCategory =
    | "Absorption Panels"
    | "Bass Control"
    | "Diffusion"
    | "Ceiling & Portable"
    | "Wall Systems"
    | "Sealing & Openings"
    | "Floor & Vibration"
    | "Ceiling & HVAC";

interface MaterialProperties {
    category: MaterialCategory;
    nrc: number;
    stc: number | null;
    density: string;
    thickness: string;
    fireRating: string;
    application: string;
}

const categoryColors: Record<MaterialCategory, "secondary" | "danger" | "warning" | "success" | "primary" | "default"> =
    {
        "Absorption Panels": "secondary",
        "Bass Control": "danger",
        Diffusion: "warning",
        "Ceiling & Portable": "success",
        "Wall Systems": "primary",
        "Sealing & Openings": "default",
        "Floor & Vibration": "secondary",
        "Ceiling & HVAC": "warning",
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

    // Material data from API
    const [materialData, setMaterialData] = useState<Record<string, MaterialProperties> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

        // Load material data and report in parallel
        Promise.all([fetchFromApi<Record<string, MaterialProperties>>("material-data"), fetchMaterialsReport(id)])
            .then(([matData, reportData]) => {
                setMaterialData(matData);
                setRecord(reportData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
                if (err.message?.includes("not found") || err.message?.includes("404")) {
                    setNotFound(true);
                } else {
                    setLoadError("Failed to load material data.");
                }
                setIsLoading(false);
            });
    }, [id]);

    // Block rendering if validation failed or pending
    if (isValid === false) return <UnauthorizedAlert />;

    // Show loading while validating
    if (isValid === null) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Loading...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/materials")}
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

    if (isLoading || !record || !materialData) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <Spinner size="lg" />
                <p className="ml-3 text-lg text-default-500">Loading report...</p>
            </div>
        );
    }

    if (loadError) return <LoadErrorCard message={loadError} />;

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
                    onPress={() => navigate("/materials")}
                    className="mb-4"
                >
                    Back to Materials Reports
                </Button>
                <div className="flex items-center gap-3 mb-3">
                    <Container size={40} className="text-primary" />
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
                                                <Chip size="sm" variant="flat" color={categoryColors[data.category]}>
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
