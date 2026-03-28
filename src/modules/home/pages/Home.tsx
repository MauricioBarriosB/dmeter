import { useState } from "react";
import { Home as HomeIcon, Mic, Waves, Drum, Container, Music4, LogIn, UserPlus } from "lucide-react";
import { Accordion, AccordionItem, Button, type Selection } from "@heroui/react";
import { Link } from "react-router-dom";
import { MeterFeatures, AcousticsFeatures, MaterialsFeatures, InstrumentsFeatures, AudioFeatures } from "../components";
import { useAuthContext } from "@modules/user/context/AuthContext";

type SelectedKey = "meter" | "acoustics" | "materials" | "instruments" | "audio" | null;

export default function Home() {
    const [selectedKey, setSelectedKey] = useState<SelectedKey>(null);
    const { isAuthenticated } = useAuthContext();

    const handleSelectionChange = (keys: Selection) => {
        if (keys === "all") return;
        const selected = Array.from(keys)[0] as SelectedKey;
        setSelectedKey(selected || null);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <HomeIcon size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        About DMeter
                    </h1>
                </div>
                <ul className="text-lg text-default-600 font-normal list-disc ml-5 space-y-1">
                    <li>
                        Analyze audio files with comprehensive frequency spectrum analysis, loudness metrics, harmonic
                        content detection, and temporal analysis for mastering and quality control.
                    </li>
                    <li>
                        Analyze audio input from your microphone with real-time decibel monitoring. Track current, peak,
                        average, and range dB values while viewing a live frequency spectrum visualization.
                    </li>
                    <li>
                        Calculate room acoustics with professional RT60, speech intelligibility metrics, and
                        frequency-dependent analysis for audio engineers and acoustic consultants.
                    </li>
                    <li>
                        Generate comprehensive materials reports for building professional acoustic spaces with 12 build
                        types, 15 acoustic treatment options, and 19 insulation materials.
                    </li>
                    <li>
                        Create instrument lists for musical ensembles with 12 ensemble types, 14 genres, and 100+
                        instruments across 8 categories including rock, strings, woodwinds, brass, percussion,
                        keyboards, electronic, and ethnic instruments.
                    </li>

                    <li>All analysis sessions and reports are automatically saved for review and comparison.</li>

                    <li>
                        All analyzed audio is neither saved nor stored in a database; once the analysis is complete, the
                        audio is completely detached from the application.
                    </li>
                </ul>

                {/* Conditional buttons based on auth state */}
                {isAuthenticated ? (
                    // Feature buttons for authenticated users
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                        <Button
                            as={Link}
                            to="/audio"
                            color="default"
                            size="lg"
                            variant="shadow"
                            className="font-semibold text-lg px-8 w-full sm:w-auto"
                            startContent={<Music4 size={20} />}
                        >
                            Audio
                        </Button>
                        <Button
                            as={Link}
                            to="/meter"
                            color="primary"
                            size="lg"
                            variant="shadow"
                            className="font-semibold text-lg px-8 w-full sm:w-auto"
                            startContent={<Mic size={20} />}
                        >
                            Meter
                        </Button>
                        <Button
                            as={Link}
                            to="/acoustics"
                            color="secondary"
                            size="lg"
                            variant="shadow"
                            className="font-semibold text-lg px-8 w-full sm:w-auto"
                            startContent={<Waves size={20} />}
                        >
                            Acoustics
                        </Button>
                        <Button
                            as={Link}
                            to="/materials"
                            color="danger"
                            size="lg"
                            variant="shadow"
                            className="font-semibold text-lg px-8 w-full sm:w-auto"
                            startContent={<Container size={20} />}
                        >
                            Materials
                        </Button>
                        <Button
                            as={Link}
                            to="/instruments"
                            color="success"
                            size="lg"
                            variant="shadow"
                            className="font-semibold text-lg px-8 text-white w-full sm:w-auto bg-green-600"
                            startContent={<Drum size={20} />}
                        >
                            Instruments
                        </Button>
                    </div>
                ) : (
                    // Login/Register buttons for non-authenticated users
                    <div className="flex flex-col justify-center items-center gap-6 mt-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
                            Join DMeter Today
                        </h2>
                        <p className="text-default-500 text-center max-w-lg text-base sm:text-lg">
                            Create a free account to access powerful audio analysis tools, real-time metering, acoustic
                            measurements, and much more.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-2">
                            <Button
                                as={Link}
                                to="/login"
                                color="primary"
                                size="lg"
                                variant="shadow"
                                className="font-semibold text-xl px-12 py-8 w-full sm:w-auto"
                                startContent={<LogIn size={24} />}
                            >
                                Sign In
                            </Button>
                            <Button
                                as={Link}
                                to="/register"
                                color="secondary"
                                size="lg"
                                variant="shadow"
                                className="font-semibold text-xl px-12 py-8 w-full sm:w-auto"
                                startContent={<UserPlus size={24} />}
                            >
                                Create Account
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Accordion
                variant="splitted"
                selectionMode="single"
                selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
                onSelectionChange={handleSelectionChange}
            >
                {/* Audio Features */}
                <AccordionItem
                    key="audio"
                    aria-label="Audio Analysis Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Music4 size={24} className="text-gray-400" />
                            Audio Analysis Features
                        </span>
                    }
                >
                    {selectedKey === "audio" && <AudioFeatures />}
                </AccordionItem>
                {/* Audio Meter Features */}
                <AccordionItem
                    key="meter"
                    aria-label="Audio Meter Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Mic size={24} className="text-primary" />
                            Audio Meter Features
                        </span>
                    }
                >
                    {selectedKey === "meter" && <MeterFeatures />}
                </AccordionItem>

                {/* Space Acoustics Features */}
                <AccordionItem
                    key="acoustics"
                    aria-label="Space Acoustics Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Waves size={24} className="text-secondary" />
                            Space Acoustics Features
                        </span>
                    }
                >
                    {selectedKey === "acoustics" && <AcousticsFeatures />}
                </AccordionItem>

                {/* Materials Features */}
                <AccordionItem
                    key="materials"
                    aria-label="Materials Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Container size={24} className="text-danger" />
                            Materials Features
                        </span>
                    }
                >
                    {selectedKey === "materials" && <MaterialsFeatures />}
                </AccordionItem>

                {/* Instruments Features */}
                <AccordionItem
                    key="instruments"
                    aria-label="Instruments Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Drum size={24} className="text-success" />
                            Instruments Features
                        </span>
                    }
                >
                    {selectedKey === "instruments" && <InstrumentsFeatures />}
                </AccordionItem>
            </Accordion>
        </div>
    );
}
