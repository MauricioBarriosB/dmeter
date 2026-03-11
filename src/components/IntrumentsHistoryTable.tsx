import { useNavigate } from "react-router-dom";
import { Trash2, FileText, Pencil } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import type { InstrumentsReportRecord } from "../helpers/analysisStorage";

interface InstrumentsHistoryTableProps {
    history: InstrumentsReportRecord[];
    onDeleteRecord: (id: string) => void;
    onClearHistory: () => void;
    onEditRecord: (record: InstrumentsReportRecord) => void;
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

export default function InstrumentsHistoryTable({
    history,
    onDeleteRecord,
    onClearHistory,
    onEditRecord,
}: Readonly<InstrumentsHistoryTableProps>) {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Instruments Reports History</h2>
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
                        No instruments reports yet. Create your first report using the form above.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Report Name</th>
                                    <th className="text-left p-3 font-semibold">Date</th>
                                    <th className="text-left p-3 font-semibold">Ensemble</th>
                                    <th className="text-left p-3 font-semibold">Genre</th>
                                    <th className="text-left p-3 font-semibold">Instruments</th>
                                    <th className="text-center p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} className="border-b border-default-100 hover:bg-default-50">
                                        <td className="p-3 font-medium">{record.reportName}</td>
                                        <td className="p-3 text-sm">{formatDate(record.createdAt)}</td>
                                        <td className="p-3">
                                            <Chip color="primary" size="sm" variant="flat">
                                                {record.ensembleTypeLabel}
                                            </Chip>
                                        </td>
                                        <td className="p-3">
                                            <Chip color="secondary" size="sm" variant="flat">
                                                {record.genreLabel}
                                            </Chip>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <span className="text-default-600">
                                                {record.selectedInstruments.length} instrument
                                                {record.selectedInstruments.length !== 1 ? "s" : ""} selected
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 justify-center">
                                                <Button
                                                    color="primary"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => navigate(`/instruments/${record.id}`)}
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
