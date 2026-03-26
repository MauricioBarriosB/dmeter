import { useState, useRef, useEffect } from "react";
import { Upload, Music2, Loader2, X } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Progress } from "@heroui/react";
import {
    loadAudioData,
    getGenreLabelSync,
    getMediaLabelSync,
    formatFileSize,
    type AudioRecord,
    type GenreOption,
    type DistributionType,
    type MediaOption,
} from "../../helpers/audioStorage";
import { analyzeAudioFile } from "../../helpers/audioAnalyzer";
import LoadErrorCard from "../globals/LoadErrorCard";
import LoadingCard from "../globals/LoadingCard";

interface AudioFormProps {
    onSubmit: (record: AudioRecord) => void;
}

export default function AudioForm({ onSubmit }: Readonly<AudioFormProps>) {
    const [reportName, setReportName] = useState("");
    const [genre, setGenre] = useState("");
    const [distributionType, setDistributionType] = useState("");
    const [media, setMedia] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Data from API
    const [genreOptions, setGenreOptions] = useState<GenreOption[]>([]);
    const [distributionTypes, setDistributionTypes] = useState<DistributionType[]>([]);
    const [mediaByDistribution, setMediaByDistribution] = useState<Record<string, MediaOption[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    // Load data from API on mount
    useEffect(() => {
        loadAudioData()
            .then((data) => {
                setGenreOptions(data.genreOptions);
                setDistributionTypes(data.distributionTypes);
                setMediaByDistribution(data.mediaByDistribution);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load audio data:", err);
                setLoadError("Failed to load form data. Please refresh the page.");
                setIsLoading(false);
            });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/flac", "audio/aac"];
            if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/i)) {
                setError("Please select a valid audio file (MP3, WAV, OGG, FLAC, AAC)");
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                setError("File size must be less than 50MB");
                return;
            }
            setSelectedFile(file);
            setError("");
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reportName.trim()) {
            setError("Please enter a report name");
            return;
        }
        if (!genre) {
            setError("Please select a genre");
            return;
        }
        if (!distributionType) {
            setError("Please select a distribution type");
            return;
        }
        if (!media) {
            setError("Please select a media type");
            return;
        }
        if (!selectedFile) {
            setError("Please select an audio file");
            return;
        }

        setIsAnalyzing(true);
        setProgress(10);
        setError("");

        try {
            setProgress(20);
            await new Promise((resolve) => setTimeout(resolve, 100));

            setProgress(40);
            const analysis = await analyzeAudioFile(selectedFile);

            setProgress(80);
            await new Promise((resolve) => setTimeout(resolve, 100));

            const record: AudioRecord = {
                id: crypto.randomUUID(),
                reportName: reportName.trim(),
                genre,
                genreLabel: getGenreLabelSync(genre),
                media,
                mediaLabel: getMediaLabelSync(media),
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                fileType: selectedFile.type || "audio/unknown",
                frequencyAnalysis: analysis.frequencyAnalysis,
                loudnessMetrics: analysis.loudnessMetrics,
                temporalAnalysis: analysis.temporalAnalysis,
                createdAt: new Date().toISOString(),
                analyzedAt: new Date().toISOString(),
            };

            setProgress(100);
            onSubmit(record);

            // Reset form
            setReportName("");
            setGenre("");
            setDistributionType("");
            setMedia("");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error("Analysis error:", err);
            setError("Failed to analyze audio file. Please try a different file.");
        } finally {
            setIsAnalyzing(false);
            setProgress(0);
        }
    };

    if (isLoading) {
        return <LoadingCard cardClassName="mb-8" />;
    }

    if (loadError) {
        return <LoadErrorCard message={loadError} maxWidth={undefined} cardClassName="mb-8" />;
    }

    return (
        <Card className="mb-8">
            <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Music2 size={24} className="text-primary" />
                    Create Audio Analysis Report
                </h2>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Report Name */}
                        <Input
                            label="Report Name"
                            placeholder="Enter report name"
                            value={reportName}
                            onValueChange={setReportName}
                            isDisabled={isAnalyzing}
                            isRequired
                        />

                        {/* Genre */}
                        <Select
                            label="Genre"
                            placeholder="Select genre"
                            selectedKeys={genre ? [genre] : []}
                            onSelectionChange={(keys) => setGenre(Array.from(keys)[0] as string)}
                            isDisabled={isAnalyzing}
                            isRequired
                        >
                            {genreOptions.map((option) => (
                                <SelectItem key={option.value}>{option.label}</SelectItem>
                            ))}
                        </Select>

                        {/* Distribution Type */}
                        <Select
                            label="Distribution Type"
                            placeholder="Select distribution type"
                            selectedKeys={distributionType ? [distributionType] : []}
                            onSelectionChange={(keys) => {
                                const newType = Array.from(keys)[0] as string;
                                setDistributionType(newType);
                                setMedia("");
                            }}
                            isDisabled={isAnalyzing}
                            isRequired
                        >
                            {distributionTypes.map((option) => (
                                <SelectItem key={option.value}>{option.label}</SelectItem>
                            ))}
                        </Select>

                        {/* Media */}
                        <Select
                            label="Media Format"
                            placeholder={distributionType ? "Select media format" : "Select distribution type first"}
                            selectedKeys={media ? [media] : []}
                            onSelectionChange={(keys) => setMedia(Array.from(keys)[0] as string)}
                            isDisabled={isAnalyzing || !distributionType}
                            isRequired
                        >
                            {(mediaByDistribution[distributionType] || []).map((option) => (
                                <SelectItem key={option.value}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <p className="text-sm text-default-600 mb-2">Audio File</p>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                selectedFile
                                    ? "border-success bg-success/10"
                                    : "border-default-300 hover:border-primary"
                            }`}
                        >
                            {selectedFile ? (
                                <div className="flex items-center justify-center gap-4">
                                    <Music2 size={32} className="text-success" />
                                    <div className="text-left">
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-sm text-default-500">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                    <Button
                                        isIconOnly
                                        color="danger"
                                        variant="light"
                                        size="sm"
                                        onPress={handleRemoveFile}
                                        isDisabled={isAnalyzing}
                                    >
                                        <X size={18} />
                                    </Button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <Upload size={32} className="mx-auto mb-2 text-default-400" />
                                    <p className="text-default-600">Click to upload or drag and drop</p>
                                    <p className="text-sm text-default-400">MP3, WAV, OGG, FLAC, AAC (max 50MB)</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isAnalyzing}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {isAnalyzing && (
                        <div className="space-y-2">
                            <Progress
                                value={progress}
                                color="primary"
                                className="w-full"
                                label="Analyzing audio..."
                                showValueLabel
                            />
                            <p className="text-sm text-center text-default-500">
                                {progress < 30 && "Loading audio file..."}
                                {progress >= 30 && progress < 60 && "Performing frequency analysis..."}
                                {progress >= 60 && progress < 90 && "Calculating metrics..."}
                                {progress >= 90 && "Finalizing report..."}
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                            <p className="text-danger text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            color="primary"
                            size="lg"
                            isDisabled={
                                isAnalyzing || !reportName || !genre || !distributionType || !media || !selectedFile
                            }
                            startContent={
                                isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Music2 size={20} />
                            }
                        >
                            {isAnalyzing ? "Analyzing..." : "Analyze Audio"}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
