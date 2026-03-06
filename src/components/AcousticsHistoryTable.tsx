import { useNavigate } from "react-router-dom";
import { Trash2, FileText, Pencil } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import type { AcousticsRecord } from "../helpers/analysisStorage";

interface AcousticsHistoryTableProps {
    history: AcousticsRecord[];
    onDeleteRecord: (id: string) => void;
    onClearHistory: () => void;
    onEditRecord: (record: AcousticsRecord) => void;
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

const getPurposeLabel = (key: string) => {
    const labels: Record<string, string> = {
        recording_studio: "Recording Studio",
        control_room: "Control Room",
        broadcast: "Broadcast Studio",
        rehearsal: "Rehearsal Room",
        concert: "Concert Hall",
        home_theater: "Home Theater",
        classroom: "Classroom",
        conference: "Conference Room",
        worship: "Worship Space",
        auditorium: "Auditorium",
        parlor: "Parlor",
        reading: "Reading Room",
        library: "Library",
    };
    return labels[key] || key;
};

export default function AcousticsHistoryTable({
    history,
    onDeleteRecord,
    onClearHistory,
    onEditRecord,
}: AcousticsHistoryTableProps) {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Acoustics Analysis History</h2>
                {history.length > 0 && (
                    <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        startContent={<Trash2 size={16} />}
                        onPress={onClearHistory}
                    >
                        Clear All
                    </Button>
                )}
            </CardHeader>
            <CardBody>
                {history.length === 0 ? (
                    <p className="text-center text-default-500 py-8">
                        No acoustics analysis records yet. Configure a room to create your first analysis.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Name</th>
                                    <th className="text-left p-3 font-semibold">Date</th>
                                    <th className="text-left p-3 font-semibold">Dimensions</th>
                                    <th className="text-left p-3 font-semibold">Purpose</th>
                                    <th className="text-left p-3 font-semibold">Environment</th>
                                    <th className="text-center p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} className="border-b border-default-100 hover:bg-default-50">
                                        <td className="p-3 font-medium">{record.analysisName}</td>
                                        <td className="p-3 text-sm">{formatDate(record.date)}</td>
                                        <td className="p-3 text-sm">
                                            {record.roomHeight}×{record.roomWidth}×{record.roomDepth} m
                                        </td>
                                        <td className="p-3">
                                            <Chip color="primary" size="sm" variant="flat">
                                                {getPurposeLabel(record.roomPurpose)}
                                            </Chip>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {record.temperature}°C, {record.humidity}% RH
                                            {parseInt(record.occupancy) > 0 && `, ${record.occupancy} ppl`}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 justify-center">
                                                <Button
                                                    color="primary"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => navigate(`/acoustics/${record.id}`)}
                                                    title="View Report"
                                                >
                                                    <FileText size={16} />
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => onEditRecord(record)}
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => onDeleteRecord(record.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
