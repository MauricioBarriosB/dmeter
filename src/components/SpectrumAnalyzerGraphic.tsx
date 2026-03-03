import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { formatFrequency, type PaddedPeak } from "../helpers/spectrumPeaksHelper";

interface SpectrumAnalyzerGraphicProps {
    paddedPeaks: PaddedPeak[];
}

export default function SpectrumAnalyzerGraphic({ paddedPeaks }: SpectrumAnalyzerGraphicProps) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-semibold">Spectrum Analyzer Peaks</h2>
            </CardHeader>
            <CardBody>
                <div className="rounded-lg p-4">
                    {/* Y-axis labels */}
                    <div className="flex">
                        <div className="flex flex-col justify-between text-xs text-gray-400 pr-2 h-64">
                            <span>0 dB</span>
                            <span>-25</span>
                            <span>-50</span>
                            <span>-75</span>
                            <span>-100</span>
                        </div>

                        {/* Bars container */}
                        <div className="flex-1 flex items-end h-64 border-l border-b border-gray-700">
                            {paddedPeaks.map((peak, index) => {
                                if (peak.amplitude === null) {
                                    // Gray placeholder bar for missing frequency (100% height)
                                    return (
                                        <div
                                            key={index}
                                            className="flex-1 flex flex-col items-center h-full justify-end px-1"
                                        >
                                            <div
                                                className="w-1.5 rounded-t-sm"
                                                style={{
                                                    height: "100%",
                                                    background: "linear-gradient(to top, #1f2937, #374151, #4B5563)",
                                                    opacity: 0.3,
                                                }}
                                            />
                                        </div>
                                    );
                                }

                                // Normalize height (0-100%)
                                const heightPercent = Math.max(0, ((peak.amplitude + 100) / 100) * 100);
                                // Color based on amplitude (green -> yellow -> red)
                                const hue = 120 - (peak.amplitude + 100) * 1.2;

                                return (
                                    <div
                                        key={index}
                                        className="flex-1 flex flex-col items-center h-full justify-end px-1"
                                    >
                                        {/* Bar */}
                                        <div
                                            className="w-1.5 rounded-t-sm transition-all duration-300 relative group"
                                            style={{
                                                height: `${heightPercent}%`,
                                                background: `linear-gradient(to top,
                          hsl(${hue}, 80%, 35%),
                          hsl(${hue}, 90%, 50%),
                          hsl(${hue}, 100%, 65%))`,
                                                boxShadow: `0 0 10px hsla(${hue}, 80%, 50%, 0.5)`,
                                            }}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {formatFrequency(peak.frequency)}
                                                <br />
                                                {peak.amplitude} dB
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* X-axis labels (frequency) - only show on wider screens */}
                    {windowWidth > 740 && (
                        <div className="flex ml-8">
                            <div className="flex-1 flex">
                                {paddedPeaks.map((peak, index) => (
                                    <div key={index} className="flex-1 flex justify-center">
                                        <span
                                            className={`transform -rotate-45 origin-center whitespace-nowrap ${peak.amplitude === null ? "text-gray-600" : "text-gray-400"}`}
                                            style={{ fontSize: "9px" }}
                                        >
                                            {formatFrequency(peak.frequency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
