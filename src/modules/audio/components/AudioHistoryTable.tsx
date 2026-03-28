import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, FileText, Music2 } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, useDisclosure } from "@heroui/react";
import ConfirmDialog from "@components/ConfirmDialog";
import type { ChipColor, AudioRecord } from "../types";
import { formatFileSize, formatDuration } from "../helpers/audioStorage";

interface AudioHistoryTableProps {
    history: AudioRecord[];
    onDeleteRecord: (id: string) => void;
    onClearHistory: () => void;
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

const getGenreColor = (genre: string): ChipColor => {
    const colors: Record<string, ChipColor> = {
        rock: "danger",
        pop: "primary",
        jazz: "warning",
        classical: "secondary",
        electronic: "success",
        hip_hop: "primary",
        metal: "danger",
        blues: "warning",
        folk: "success",
        indie: "secondary",
    };
    return colors[genre] || "default";
};

const getMediaColor = (media: string): ChipColor => {
    const colors: Record<string, ChipColor> = {
        streaming: "success",
        spotify: "success",
        youtube: "danger",
        radio: "primary",
        cd: "secondary",
        vinyl: "warning",
        mp3: "default",
    };
    return colors[media] || "default";
};

export default function AudioHistoryTable({
    history,
    onDeleteRecord,
    onClearHistory,
}: Readonly<AudioHistoryTableProps>) {
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setRecordToDelete(id);
        onDeleteOpen();
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            onDeleteRecord(recordToDelete);
            setRecordToDelete(null);
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Music2 size={24} className="text-primary" />
                    Audio Analysis History
                </h2>
                {history.length > 0 && (
                    <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        startContent={<Trash2 size={16} />}
                        onPress={onOpen}
                    >
                        Clear All
                    </Button>
                )}
                <ConfirmDialog
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    title="Confirm Clear All"
                    message="Are you sure you want to delete all audio analysis records? This action cannot be undone."
                    confirmText="Clear All"
                    onConfirm={onClearHistory}
                />
                <ConfirmDialog
                    isOpen={isDeleteOpen}
                    onOpenChange={onDeleteOpenChange}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this audio analysis record? This action cannot be undone."
                    confirmText="Delete"
                    onConfirm={confirmDelete}
                />
            </CardHeader>
            <CardBody>
                {history.length === 0 ? (
                    <p className="text-center text-default-500 py-8">
                        No audio analysis records yet. Upload an audio file to create your first analysis.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Report Name</th>
                                    <th className="text-left p-3 font-semibold">Date</th>
                                    <th className="text-left p-3 font-semibold">File</th>
                                    <th className="text-left p-3 font-semibold">Genre</th>
                                    <th className="text-left p-3 font-semibold">Media</th>
                                    <th className="text-left p-3 font-semibold">Duration</th>
                                    <th className="text-left p-3 font-semibold">Peak dB</th>
                                    <th className="text-center p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} className="border-b border-default-100 hover:bg-default-50">
                                        <td className="p-3 font-medium">{record.reportName}</td>
                                        <td className="p-3 text-sm">{formatDate(record.createdAt)}</td>
                                        <td className="p-3">
                                            <div className="text-sm">
                                                <p className="truncate max-w-32" title={record.fileName}>
                                                    {record.fileName}
                                                </p>
                                                <p className="text-default-400">{formatFileSize(record.fileSize)}</p>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Chip color={getGenreColor(record.genre)} size="sm" variant="flat">
                                                {record.genreLabel}
                                            </Chip>
                                        </td>
                                        <td className="p-3">
                                            <Chip color={getMediaColor(record.media)} size="sm" variant="flat">
                                                {record.mediaLabel}
                                            </Chip>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {formatDuration(record.temporalAnalysis.duration)}
                                        </td>
                                        <td className="p-3 text-sm font-mono">
                                            {record.loudnessMetrics.peakDb.toFixed(1)} dB
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 justify-center">
                                                <Button
                                                    color="primary"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => navigate(`/audio/${record.id}`)}
                                                    title="View Detailed Analysis"
                                                >
                                                    <FileText size={16} />
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    size="sm"
                                                    isIconOnly
                                                    onPress={() => handleDeleteClick(record.id)}
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
