import { useState, useEffect } from "react";
import { Music4 } from "lucide-react";
import { addToast } from "@heroui/react";
import HowToUse from "@components/HowToUse";
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
                <HowToUse
                    title="How to Use Audio Analysis"
                    steps={[
                        {
                            number: 1,
                            title: "Name Your Report",
                            description: "Enter a descriptive name for your audio analysis report.",
                        },
                        {
                            number: 2,
                            title: "Select Genre & Media",
                            description: "Choose the music genre and target media distribution format.",
                        },
                        {
                            number: 3,
                            title: "Upload Audio",
                            description: "Select an audio file (MP3, WAV, OGG, FLAC) up to 50MB.",
                        },
                        {
                            number: 4,
                            title: "Start Analysis",
                            description: "Click on button Analyse Audio for start and store analysis.",
                        },
                        {
                            number: 5,
                            title: "View Results",
                            description: "Click the detail icon to see comprehensive frequency analysis.",
                        },
                    ]}
                />
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
