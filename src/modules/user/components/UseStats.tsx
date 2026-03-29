import { useState, useEffect } from "react";
import { Card, CardBody, Chip, Spinner } from "@heroui/react";
import { TrendingUp, Clock, Hash, Mic, Waves, Container, Drum, Music4 } from "lucide-react";
import { fetchReportStats } from "@services/apiCrud";
import type { ReportStats } from "../types";

const typeIcons: Record<string, React.ReactNode> = {
    analysis: <Mic size={18} />,
    acoustics: <Waves size={18} />,
    materials: <Container size={18} />,
    instruments: <Drum size={18} />,
    audio: <Music4 size={18} />,
};

const typeColors: Record<string, "primary" | "secondary" | "success" | "warning" | "danger"> = {
    analysis: "primary",
    acoustics: "secondary",
    materials: "danger",
    instruments: "success",
    audio: "warning",
};

const typeLabels: Record<string, string> = {
    analysis: "Meter Analysis",
    acoustics: "Acoustics",
    materials: "Materials",
    instruments: "Instruments",
    audio: "Audio Analysis",
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return "No reports yet";
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateString;
    }
};

export default function UseStats() {
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReportStats()
            .then(setStats)
            .catch((err) => console.error("Failed to load stats:", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardBody className="flex items-center justify-center py-10">
                    <Spinner label="Loading stats..." />
                </CardBody>
            </Card>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Total Reports */}
            <Card>
                <CardBody className="gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Hash size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-default-500">Total Reports</p>
                            <p className="text-2xl font-bold">{stats.totalReports}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Most Used Feature */}
            <Card>
                <CardBody className="gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <TrendingUp size={20} className="text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-default-500">Most Used</p>
                            {stats.mostUsedType ? (
                                <div className="flex items-center gap-2">
                                    <Chip
                                        color={typeColors[stats.mostUsedType]}
                                        variant="flat"
                                        size="sm"
                                        startContent={typeIcons[stats.mostUsedType]}
                                    >
                                        {stats.mostUsedLabel}
                                    </Chip>
                                    <span className="text-sm text-default-400">({stats.mostUsedCount})</span>
                                </div>
                            ) : (
                                <p className="text-sm text-default-400">No data</p>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Last Report */}
            <Card>
                <CardBody className="gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                            <Clock size={20} className="text-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-default-500">Last Report</p>
                            <p className="text-sm font-medium">{formatDate(stats.lastReportDate)}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
