import { useState } from "react";
import { Home as HomeIcon, Mic, Waves, Music, FileText } from "lucide-react";
import { Accordion, AccordionItem, Button, type Selection } from "@heroui/react";
import { Link } from "react-router-dom";
import { MeterFeatures, AcousticsFeatures, MaterialsFeatures, InstrumentsFeatures } from "../components/home";

type SelectedKey = "meter" | "acoustics" | "materials" | "instruments" | null;

export default function Home() {
    const [selectedKey, setSelectedKey] = useState<SelectedKey>(null);

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
                        instruments across 8 categories including rock, strings, woodwinds, brass, percussion, keyboards,
                        electronic, and ethnic instruments.
                    </li>
                    <li>All analysis sessions and reports are automatically saved for review and comparison.</li>
                </ul>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
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
                        startContent={<FileText size={20} />}
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
                        startContent={<Music size={20} />}
                    >
                        Instruments
                    </Button>
                </div>
            </div>

            {/* Features Accordion */}
            <Accordion
                variant="splitted"
                selectionMode="single"
                selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
                onSelectionChange={handleSelectionChange}
            >
                {/* Audio Meter Features */}
                <AccordionItem
                    key="meter"
                    aria-label="Audio Meter Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Mic size={24} className="text-warning" />
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
                            <FileText size={24} className="text-primary" />
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
                            <Music size={24} className="text-success" />
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
