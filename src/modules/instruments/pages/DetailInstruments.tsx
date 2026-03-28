import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Drum, Users } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { fetchInstrumentsReport } from "@services/apiCrud";
import type { InstrumentsReportRecord } from "../types";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import LoadErrorCard from "@components/LoadErrorCard";
import LoadingCard from "@components/LoadingCard";
import { fetchFromApi } from "@services/apiConfig";

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

type InstrumentCategoryType =
    | "Rock & Metal"
    | "Strings"
    | "Woodwinds"
    | "Brass"
    | "Percussion"
    | "Keyboards"
    | "Electronic"
    | "Ethnic";

interface InstrumentProperties {
    category: InstrumentCategoryType;
    frequencyLow: number;
    frequencyHigh: number;
    fundamentalRange: string;
    harmonicsRange: string;
}

const categoryColors: Record<
    InstrumentCategoryType,
    "secondary" | "danger" | "warning" | "success" | "primary" | "default"
> = {
    "Rock & Metal": "danger",
    Strings: "primary",
    Woodwinds: "secondary",
    Brass: "success",
    Percussion: "warning",
    Keyboards: "default",
    Electronic: "primary",
    Ethnic: "warning",
};

const getFrequencyColor = (low: number, high: number): "success" | "warning" | "danger" | "default" => {
    const range = high - low;
    if (range >= 10000) return "success";
    if (range >= 5000) return "warning";
    if (range > 0) return "danger";
    return "default";
};

const formatFrequency = (freq: number): string => {
    if (freq === 0) return "N/A";
    if (freq >= 1000) return `${(freq / 1000).toFixed(1)} kHz`;
    return `${freq} Hz`;
};

export default function DetailInstruments() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [record, setRecord] = useState<InstrumentsReportRecord | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isValid, setisValid] = useState<boolean | null>(null);

    // Instrument data from API
    const [instrumentData, setInstrumentData] = useState<Record<string, InstrumentProperties> | null>(null);
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

        // Load instrument data and report in parallel
        Promise.all([fetchFromApi<Record<string, InstrumentProperties>>("instrument-data"), fetchInstrumentsReport(id)])
            .then(([instData, reportData]) => {
                setInstrumentData(instData);
                setRecord(reportData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
                if (err.message?.includes("not found") || err.message?.includes("404")) {
                    setNotFound(true);
                } else {
                    setLoadError("Failed to load instrument data.");
                }
                setIsLoading(false);
            });
    }, [id]);

    if (isValid === false) return <UnauthorizedAlert />;

    if (isValid === null) return <LoadingCard message="Loading..." maxWidth="7xl" />;

    if (notFound) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/instruments")}
                    className="mb-6"
                >
                    Back to Instruments Reports
                </Button>
                <Card>
                    <CardBody>
                        <p className="text-center text-default-500 py-8">Report not found. It may have been deleted.</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (isLoading || !record || !instrumentData) return <LoadingCard message="Loading report..." maxWidth="7xl" />;

    if (loadError) return <LoadErrorCard message={loadError} />;

    // Calculate frequency range stats
    const instrumentsWithData = record.selectedInstruments
        .map((key) => instrumentData[key])
        .filter((data) => data !== undefined && data.frequencyLow > 0);
    const lowestFreq = instrumentsWithData.length > 0 ? Math.min(...instrumentsWithData.map((i) => i.frequencyLow)) : 0;
    const highestFreq =
        instrumentsWithData.length > 0 ? Math.max(...instrumentsWithData.map((i) => i.frequencyHigh)) : 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/instruments")}
                    className="mb-4"
                >
                    Back to Instruments Reports
                </Button>
                <div className="flex items-center gap-3 mb-3">
                    <Drum size={40} className="text-primary" />
                    <div>
                        <h1
                            className="text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {record.reportName}
                        </h1>
                        <p className="text-lg text-default-500">Instruments Report</p>
                    </div>
                </div>
                <p className="text-lg text-default-600">{formatDate(record.createdAt)}</p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold">Ensemble Summary</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div>
                            <p className="text-sm text-default-500 mb-2">Ensemble Type</p>
                            <Chip color="primary" size="lg">
                                {record.ensembleTypeLabel}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Genre</p>
                            <Chip color="secondary" size="lg">
                                {record.genreLabel}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Total Instruments</p>
                            <p className="text-2xl font-bold">{record.selectedInstruments.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Lowest Frequency</p>
                            <p className="text-2xl font-bold">{formatFrequency(lowestFreq)}</p>
                            <p className="text-xs text-default-400">Sub-bass to bass range</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Highest Frequency</p>
                            <p className="text-2xl font-bold">{formatFrequency(highestFreq)}</p>
                            <p className="text-xs text-default-400">Upper harmonics</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Instruments Frequency Response</h2>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">#</th>
                                    <th className="text-left p-3 font-semibold">Instrument</th>
                                    <th className="text-left p-3 font-semibold">Category</th>
                                    <th className="text-center p-3 font-semibold">Low Freq</th>
                                    <th className="text-center p-3 font-semibold">High Freq</th>
                                    <th className="text-left p-3 font-semibold">Fundamental Range</th>
                                    <th className="text-left p-3 font-semibold">Harmonics Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                {record.selectedInstruments.map((key, index) => {
                                    const data = instrumentData[key];
                                    if (!data) return null;
                                    return (
                                        <tr key={key} className="border-b border-default-100 hover:bg-default-50">
                                            <td className="p-3 text-default-500">{index + 1}</td>
                                            <td className="p-3 font-medium">
                                                {record.selectedInstrumentsLabels[index]}
                                            </td>
                                            <td className="p-3">
                                                <Chip size="sm" variant="flat" color={categoryColors[data.category]}>
                                                    {data.category}
                                                </Chip>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Chip
                                                    size="sm"
                                                    color={data.frequencyLow > 0 ? "primary" : "default"}
                                                    variant="flat"
                                                >
                                                    {formatFrequency(data.frequencyLow)}
                                                </Chip>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Chip
                                                    size="sm"
                                                    color={getFrequencyColor(data.frequencyLow, data.frequencyHigh)}
                                                    variant="flat"
                                                >
                                                    {formatFrequency(data.frequencyHigh)}
                                                </Chip>
                                            </td>
                                            <td className="p-3 text-sm">{data.fundamentalRange}</td>
                                            <td className="p-3 text-sm text-default-600">{data.harmonicsRange}</td>
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
                    <h2 className="text-xl font-semibold">Frequency Range Legend</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Frequency Bands</h3>
                            <p className="text-sm text-default-500 mb-2">Standard audio frequency classifications</p>
                            <div className="flex flex-wrap gap-2">
                                <Chip size="sm" color="danger" variant="flat">
                                    Sub-bass: 20-60 Hz
                                </Chip>
                                <Chip size="sm" color="warning" variant="flat">
                                    Bass: 60-250 Hz
                                </Chip>
                                <Chip size="sm" color="success" variant="flat">
                                    Mids: 250 Hz-4 kHz
                                </Chip>
                                <Chip size="sm" color="primary" variant="flat">
                                    Highs: 4-20 kHz
                                </Chip>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Frequency Range (High)</h3>
                            <p className="text-sm text-default-500 mb-2">
                                Indicates the upper frequency limit of each instrument
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Chip size="sm" color="success" variant="flat">
                                    10+ kHz Wide range
                                </Chip>
                                <Chip size="sm" color="warning" variant="flat">
                                    5-10 kHz Medium
                                </Chip>
                                <Chip size="sm" color="danger" variant="flat">
                                    &lt;5 kHz Narrow
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
                    onPress={() => navigate("/instruments")}
                >
                    Back to Instruments Reports
                </Button>
            </div>
        </div>
    );
}
