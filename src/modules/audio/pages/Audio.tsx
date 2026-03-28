import { useState, useEffect } from "react";
import { Music4, Play, HelpCircle } from "lucide-react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, addToast } from "@heroui/react";
import { loadAudioHistory, saveAudioRecord, deleteAudioRecord, clearAudioHistory } from "../helpers/audioStorage";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import AudioForm from "../components/AudioForm";
import AudioHistoryTable from "../components/AudioHistoryTable";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import type { AudioRecord } from "../types";

export default function Audio() {
    const [history, setHistory] = useState<AudioRecord[]>([]);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });
        loadAudioHistory().then((loaded) => {
            setHistory(loaded);
            setIsLoading(false);
        });
    }, []);

    const handleFormSubmit = async (record: AudioRecord) => {
        try {
            const saved = await saveAudioRecord(record);
            if (saved) {
                setHistory((prev) => [record, ...prev]);
                addToast({
                    title: "Analysis created",
                    description: `"${record.reportName}" has been created successfully.`,
                    color: "success",
                });
            }
        } catch (err) {
            console.error("Failed to save record:", err);
            addToast({
                title: "Creation failed",
                description: "Failed to create the analysis. Please try again.",
                color: "danger",
            });
        }
    };

    const handleDeleteRecord = async (id: string) => {
        const record = history.find((r) => r.id === id);
        try {
            const deleted = await deleteAudioRecord(id);
            if (deleted) {
                setHistory((prev) => prev.filter((r) => r.id !== id));
                addToast({
                    title: "Analysis deleted",
                    description: record ? `"${record.reportName}" has been deleted.` : "Analysis has been deleted.",
                    color: "success",
                });
            }
        } catch (err) {
            console.error("Failed to delete record:", err);
            addToast({
                title: "Delete failed",
                description: "Failed to delete the analysis. Please try again.",
                color: "danger",
            });
        }
    };

    const handleClearHistory = async () => {
        try {
            const cleared = await clearAudioHistory();
            if (cleared) {
                setHistory([]);
                addToast({
                    title: "History cleared",
                    description: "All audio analyses have been deleted.",
                    color: "success",
                });
            }
        } catch (err) {
            console.error("Failed to clear history:", err);
            addToast({
                title: "Clear failed",
                description: "Failed to clear history. Please try again.",
                color: "danger",
            });
        }
    };

    if (isValid === false) return <UnauthorizedAlert />;
    if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <Music4 size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Audio Analysis
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Professional audio mastering frequency analysis with spectrum visualization, loudness metrics, and
                    detailed harmonic analysis for audio engineers and music producers.
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
                                    How to Use Audio Analysis
                                </ModalHeader>
                                <ModalBody className="pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold shrink-0 text-sm">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Name Your Report</h4>
                                                <p className="text-sm text-default-600">
                                                    Enter a descriptive name for your audio analysis report.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-bold shrink-0 text-sm">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Select Genre & Media</h4>
                                                <p className="text-sm text-default-600">
                                                    Choose the music genre and target media distribution format.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Upload Audio</h4>
                                                <p className="text-sm text-default-600">
                                                    Select an audio file (MP3, WAV, OGG, FLAC) up to 50MB.
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
                                                    Click the detail icon to see comprehensive frequency analysis.
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

            <AudioForm onSubmit={handleFormSubmit} />

            <AudioHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
            />
        </div>
    );
}
