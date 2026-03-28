import { useMemo } from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { MapPin } from "lucide-react";

type InstrumentCategoryType =
    | "Rock & Metal"
    | "Strings"
    | "Woodwinds"
    | "Brass"
    | "Percussion"
    | "Keyboards"
    | "Electronic"
    | "Ethnic"
    | "Vocals";

interface InstrumentProperties {
    category: InstrumentCategoryType;
    frequencyLow: number;
    frequencyHigh: number;
    fundamentalRange: string;
    harmonicsRange: string;
}

interface InstrumentLocationChartProps {
    selectedInstruments: string[];
    selectedInstrumentsLabels: string[];
    instrumentData: Record<string, InstrumentProperties>;
}

// Category colors matching the parent component
const categoryColors: Record<InstrumentCategoryType, string> = {
    "Rock & Metal": "#f31260",
    Strings: "#006FEE",
    Woodwinds: "#7828c8",
    Brass: "#17c964",
    Percussion: "#f5a524",
    Keyboards: "#71717a",
    Electronic: "#006FEE",
    Ethnic: "#f5a524",
    Vocals: "#f31260",
};

// Orchestra positioning zones (as percentage from center-bottom where director stands)
// x: 0 = center, negative = left, positive = right (from audience view)
// y: 0 = front (near director), 100 = back
const categoryZones: Record<InstrumentCategoryType, { xMin: number; xMax: number; yMin: number; yMax: number }> = {
    Strings: { xMin: -40, xMax: 40, yMin: 15, yMax: 45 },
    Woodwinds: { xMin: -25, xMax: 25, yMin: 45, yMax: 60 },
    Brass: { xMin: -35, xMax: 35, yMin: 60, yMax: 75 },
    Percussion: { xMin: -40, xMax: 40, yMin: 75, yMax: 90 },
    Keyboards: { xMin: 30, xMax: 45, yMin: 20, yMax: 40 },
    Electronic: { xMin: -45, xMax: -30, yMin: 20, yMax: 40 },
    "Rock & Metal": { xMin: -35, xMax: 35, yMin: 30, yMax: 70 },
    Ethnic: { xMin: -30, xMax: 30, yMin: 50, yMax: 70 },
    Vocals: { xMin: -15, xMax: 15, yMin: 5, yMax: 25 },
};

export default function InstrumentLocationChart({
    selectedInstruments,
    selectedInstrumentsLabels,
    instrumentData,
}: InstrumentLocationChartProps) {
    // Calculate positions for each instrument
    const instrumentPositions = useMemo(() => {
        const categoryCount: Record<string, number> = {};
        const categoryIndex: Record<string, number> = {};

        // Count instruments per category
        selectedInstruments.forEach((key) => {
            const data = instrumentData[key];
            if (data) {
                categoryCount[data.category] = (categoryCount[data.category] || 0) + 1;
            }
        });

        return selectedInstruments
            .map((key, index) => {
                const data = instrumentData[key];
                if (!data) return null;

                const zone = categoryZones[data.category];
                const count = categoryCount[data.category] || 1;
                const currentIndex = categoryIndex[data.category] || 0;
                categoryIndex[data.category] = currentIndex + 1;

                // Distribute instruments within their zone
                const cols = Math.ceil(Math.sqrt(count));
                const row = Math.floor(currentIndex / cols);
                const col = currentIndex % cols;
                const totalRows = Math.ceil(count / cols);

                // Calculate position within zone
                const xRange = zone.xMax - zone.xMin;
                const yRange = zone.yMax - zone.yMin;
                const xStep = cols > 1 ? xRange / (cols - 1) : 0;
                const yStep = totalRows > 1 ? yRange / (totalRows - 1) : 0;

                const x = zone.xMin + col * xStep + (cols === 1 ? xRange / 2 : 0);
                const y = zone.yMin + row * yStep + (totalRows === 1 ? yRange / 2 : 0);

                return {
                    key,
                    label: selectedInstrumentsLabels[index],
                    category: data.category,
                    color: categoryColors[data.category],
                    x: 50 + x * 0.5, // Convert to percentage (50% is center)
                    y: 100 - y, // Invert Y so 0 is at bottom (director position)
                };
            })
            .filter(Boolean);
    }, [selectedInstruments, selectedInstrumentsLabels, instrumentData]);

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-primary" />
                    <h2 className="text-xl font-semibold">Instrument Stage Optimal Positions</h2>
                </div>
            </CardHeader>
            <CardBody>
                <div className="relative w-full max-w-2xl mx-auto" style={{ paddingBottom: "40%" }}>
                    {/* Stage background */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 100 60"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Stage floor - semi-circular arc */}
                        <defs>
                            <linearGradient id="stageGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#3f3f46" />
                                <stop offset="100%" stopColor="#27272a" />
                            </linearGradient>
                            <radialGradient id="spotlightGradient" cx="50%" cy="100%" r="80%">
                                <stop offset="0%" stopColor="#fafafa" stopOpacity="0.05" />
                                <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
                            </radialGradient>
                        </defs>

                        {/* Main stage area */}
                        <ellipse
                            cx="50"
                            cy="60"
                            rx="48"
                            ry="55"
                            fill="url(#stageGradient)"
                            stroke="#52525b"
                            strokeWidth="0.5"
                        />

                        {/* Spotlight effect */}
                        <ellipse cx="50" cy="60" rx="45" ry="50" fill="url(#spotlightGradient)" />

                        {/* Grid lines for reference */}
                        <line x1="50" y1="5" x2="50" y2="55" stroke="#52525b" strokeWidth="0.2" strokeDasharray="1,1" />
                        <ellipse
                            cx="50"
                            cy="60"
                            rx="20"
                            ry="22"
                            fill="none"
                            stroke="#52525b"
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                        />
                        <ellipse
                            cx="50"
                            cy="60"
                            rx="35"
                            ry="38"
                            fill="none"
                            stroke="#52525b"
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                        />

                        {/* Instrument markers */}
                        {instrumentPositions.map(
                            (inst, idx) =>
                                inst && (
                                    <g key={inst.key}>
                                        {/* Instrument dot */}
                                        <circle
                                            cx={inst.x}
                                            cy={inst.y * 0.55 + 5}
                                            r="2"
                                            fill={inst.color}
                                            stroke="#fff"
                                            strokeWidth="0.3"
                                        />
                                        {/* Instrument number */}
                                        <text
                                            x={inst.x}
                                            y={inst.y * 0.55 + 5}
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#fff"
                                            fontSize="1.5"
                                            fontWeight="bold"
                                        >
                                            {idx + 1}
                                        </text>
                                    </g>
                                ),
                        )}

                        {/* Director position marker */}
                        <g>
                            {/* Podium */}
                            <rect
                                x="47"
                                y="56"
                                width="6"
                                height="3"
                                rx="0.5"
                                fill="#71717a"
                                stroke="#a1a1aa"
                                strokeWidth="0.3"
                            />
                            {/* Director icon */}
                            <circle cx="50" cy="54" r="1.5" fill="#f5a524" stroke="#fff" strokeWidth="0.3" />
                            <line x1="50" y1="52" x2="50" y2="50" stroke="#f5a524" strokeWidth="0.5" />
                            <line x1="48" y1="51" x2="52" y2="51" stroke="#f5a524" strokeWidth="0.5" />
                        </g>

                        {/* Director label */}
                        <text x="50" y="61" textAnchor="middle" fill="#a1a1aa" fontSize="2" fontWeight="500">
                            DIRECTOR
                        </text>

                        {/* Audience area indicator */}
                        <text x="50" y="64" textAnchor="middle" fill="#52525b" fontSize="1.5">
                            (Audience)
                        </text>
                    </svg>
                </div>
            </CardBody>
        </Card>
    );
}
