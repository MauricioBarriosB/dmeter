import { useMemo } from "react";

interface FrequencyResponseChartProps {
    octaveBands: { frequency: number; magnitude: number }[];
    thirdOctaveBands?: { frequency: number; magnitude: number }[];
    spectrumData?: { frequency: number; magnitude: number }[];
    height?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    title?: string;
}

// Frequency labels for the X-axis (logarithmic scale)
const FREQ_LABELS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const DB_LABELS = [-80, -60, -40, -20, 0];

// Convert frequency to logarithmic X position (0-1 range)
function freqToX(freq: number, minFreq: number = 20, maxFreq: number = 20000): number {
    if (freq <= 0) return 0;
    const logMin = Math.log10(minFreq);
    const logMax = Math.log10(maxFreq);
    const logFreq = Math.log10(Math.max(freq, minFreq));
    return (logFreq - logMin) / (logMax - logMin);
}

// Convert dB to Y position (0-1 range, where 0 is top)
function dbToY(db: number, minDb: number = -80, maxDb: number = 0): number {
    const clampedDb = Math.max(minDb, Math.min(maxDb, db));
    return 1 - (clampedDb - minDb) / (maxDb - minDb);
}

// Format frequency for display
function formatFreq(freq: number): string {
    if (freq >= 1000) {
        return `${freq / 1000}k`;
    }
    return `${freq}`;
}

// Smooth data using moving average
function smoothData(data: { frequency: number; magnitude: number }[], windowSize: number = 3): { frequency: number; magnitude: number }[] {
    if (data.length < windowSize) return data;

    const result: { frequency: number; magnitude: number }[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        for (let j = Math.max(0, i - halfWindow); j <= Math.min(data.length - 1, i + halfWindow); j++) {
            sum += data[j].magnitude;
            count++;
        }
        result.push({
            frequency: data[i].frequency,
            magnitude: sum / count,
        });
    }

    return result;
}

export default function FrequencyResponseChart({
    octaveBands,
    thirdOctaveBands,
    spectrumData,
    height = 350,
    showGrid = true,
    showLabels = true,
    title = "Frequency Response",
}: Readonly<FrequencyResponseChartProps>) {
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const width = 900;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Generate SVG paths for all curves
    const { mainCurvePath, smoothCurvePath, octavePointsPath, filledAreaPath } = useMemo(() => {
        // Determine which data to use for the main curve (prefer spectrum > third octave > octave)
        let mainData: { frequency: number; magnitude: number }[] = [];

        // Use spectrum data if available (full frequency coverage)
        if (spectrumData && spectrumData.length > 0) {
            mainData = spectrumData.filter((d) => d.frequency >= 20 && d.frequency <= 20000);
        }
        // Fall back to third octave bands
        else if (thirdOctaveBands && thirdOctaveBands.length > 0) {
            mainData = thirdOctaveBands.filter((d) => d.frequency >= 20 && d.frequency <= 20000);
        }
        // Fall back to octave bands
        else if (octaveBands && octaveBands.length > 0) {
            mainData = octaveBands.filter((d) => d.frequency >= 20 && d.frequency <= 20000);
        }

        // Sort by frequency
        mainData = [...mainData].sort((a, b) => a.frequency - b.frequency);

        // Create main curve path (raw data)
        let mainCurvePath = "";
        if (mainData.length > 1) {
            const points = mainData.map((d) => ({
                x: padding.left + freqToX(d.frequency) * chartWidth,
                y: padding.top + dbToY(d.magnitude) * chartHeight,
            }));

            mainCurvePath = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                mainCurvePath += ` L ${points[i].x} ${points[i].y}`;
            }
        }

        // Create smoothed curve path
        let smoothCurvePath = "";
        if (mainData.length > 3) {
            const smoothedData = smoothData(mainData, 5);
            const points = smoothedData.map((d) => ({
                x: padding.left + freqToX(d.frequency) * chartWidth,
                y: padding.top + dbToY(d.magnitude) * chartHeight,
            }));

            // Use bezier curves for smoother appearance
            smoothCurvePath = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const cpx = (prev.x + curr.x) / 2;
                smoothCurvePath += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
            }
        }

        // Create octave band points path (for reference markers)
        let octavePointsPath = "";
        if (octaveBands && octaveBands.length > 0) {
            const sortedBands = [...octaveBands]
                .filter((d) => d.frequency >= 20 && d.frequency <= 20000)
                .sort((a, b) => a.frequency - b.frequency);

            if (sortedBands.length > 1) {
                const points = sortedBands.map((band) => ({
                    x: padding.left + freqToX(band.frequency) * chartWidth,
                    y: padding.top + dbToY(band.magnitude) * chartHeight,
                }));

                octavePointsPath = `M ${points[0].x} ${points[0].y}`;
                for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    const cpx = (prev.x + curr.x) / 2;
                    octavePointsPath += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
                }
            }
        }

        // Create filled area path under the smoothed curve
        let filledAreaPath = "";
        if (mainData.length > 3) {
            const smoothedData = smoothData(mainData, 5);
            const points = smoothedData.map((d) => ({
                x: padding.left + freqToX(d.frequency) * chartWidth,
                y: padding.top + dbToY(d.magnitude) * chartHeight,
            }));

            if (points.length >= 2) {
                filledAreaPath = `M ${points[0].x} ${padding.top + chartHeight}`;
                filledAreaPath += ` L ${points[0].x} ${points[0].y}`;

                for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    const cpx = (prev.x + curr.x) / 2;
                    filledAreaPath += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
                }

                filledAreaPath += ` L ${points[points.length - 1].x} ${padding.top + chartHeight}`;
                filledAreaPath += " Z";
            }
        }

        return { mainCurvePath, smoothCurvePath, octavePointsPath, filledAreaPath };
    }, [octaveBands, thirdOctaveBands, spectrumData, chartWidth, chartHeight, padding.left, padding.top]);

    // Calculate average level for reference line
    const avgMagnitude = useMemo(() => {
        const data = spectrumData || thirdOctaveBands || octaveBands;
        if (!data || data.length === 0) return -40;
        const sum = data.reduce((acc, d) => acc + d.magnitude, 0);
        return sum / data.length;
    }, [spectrumData, thirdOctaveBands, octaveBands]);

    return (
        <div className="w-full overflow-x-auto bg-default-50 rounded-lg p-2">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full min-w-[700px]"
                style={{ maxHeight: height }}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Definitions */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                        <stop offset="25%" stopColor="rgb(59, 130, 246)" />
                        <stop offset="50%" stopColor="rgb(16, 185, 129)" />
                        <stop offset="75%" stopColor="rgb(234, 179, 8)" />
                        <stop offset="100%" stopColor="rgb(239, 68, 68)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Background */}
                <rect
                    x={padding.left}
                    y={padding.top}
                    width={chartWidth}
                    height={chartHeight}
                    fill="rgb(9, 9, 11)"
                    rx="4"
                />

                {/* Title */}
                {title && (
                    <text
                        x={width / 2}
                        y={18}
                        textAnchor="middle"
                        fill="rgb(161, 161, 170)"
                        style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                        {title}
                    </text>
                )}

                {/* Grid lines */}
                {showGrid && (
                    <g strokeWidth="0.5" strokeDasharray="2,4">
                        {/* Horizontal grid lines (dB) */}
                        {DB_LABELS.map((db) => {
                            const y = padding.top + dbToY(db) * chartHeight;
                            return (
                                <line
                                    key={`h-${db}`}
                                    x1={padding.left}
                                    y1={y}
                                    x2={padding.left + chartWidth}
                                    y2={y}
                                    stroke="rgb(39, 39, 42)"
                                />
                            );
                        })}
                        {/* Vertical grid lines (frequency) */}
                        {FREQ_LABELS.map((freq) => {
                            const x = padding.left + freqToX(freq) * chartWidth;
                            return (
                                <line
                                    key={`v-${freq}`}
                                    x1={x}
                                    y1={padding.top}
                                    x2={x}
                                    y2={padding.top + chartHeight}
                                    stroke="rgb(39, 39, 42)"
                                />
                            );
                        })}
                    </g>
                )}

                {/* Average level reference line */}
                <line
                    x1={padding.left}
                    y1={padding.top + dbToY(avgMagnitude) * chartHeight}
                    x2={padding.left + chartWidth}
                    y2={padding.top + dbToY(avgMagnitude) * chartHeight}
                    stroke="rgb(234, 179, 8)"
                    strokeWidth="1"
                    strokeDasharray="8,4"
                    opacity="0.5"
                />

                {/* 0 dB reference line */}
                <line
                    x1={padding.left}
                    y1={padding.top + dbToY(0) * chartHeight}
                    x2={padding.left + chartWidth}
                    y2={padding.top + dbToY(0) * chartHeight}
                    stroke="rgb(239, 68, 68)"
                    strokeWidth="1.5"
                    opacity="0.7"
                />

                {/* Filled area under curve */}
                {filledAreaPath && (
                    <path
                        d={filledAreaPath}
                        fill="url(#areaGradient)"
                    />
                )}

                {/* Raw spectrum data (thin line) */}
                {mainCurvePath && (
                    <path
                        d={mainCurvePath}
                        fill="none"
                        stroke="rgb(63, 63, 70)"
                        strokeWidth="0.5"
                        opacity="0.5"
                    />
                )}

                {/* Smoothed main curve (gradient) */}
                {smoothCurvePath && (
                    <path
                        d={smoothCurvePath}
                        fill="none"
                        stroke="url(#curveGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                    />
                )}

                {/* Octave band reference curve */}
                {octavePointsPath && (
                    <path
                        d={octavePointsPath}
                        fill="none"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                        strokeDasharray="4,4"
                    />
                )}

                {/* Octave band data points */}
                {octaveBands
                    .filter((band) => band.frequency >= 20 && band.frequency <= 20000)
                    .map((band) => {
                        const x = padding.left + freqToX(band.frequency) * chartWidth;
                        const y = padding.top + dbToY(band.magnitude) * chartHeight;
                        return (
                            <g key={band.frequency}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill="rgb(16, 185, 129)"
                                    stroke="rgb(9, 9, 11)"
                                    strokeWidth="2"
                                />
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="white"
                                />
                            </g>
                        );
                    })}

                {/* X-axis labels (Frequency) */}
                {showLabels && (
                    <g fill="rgb(113, 113, 122)" style={{ fontSize: "10px" }}>
                        {FREQ_LABELS.map((freq) => {
                            const x = padding.left + freqToX(freq) * chartWidth;
                            return (
                                <text
                                    key={`label-${freq}`}
                                    x={x}
                                    y={padding.top + chartHeight + 16}
                                    textAnchor="middle"
                                >
                                    {formatFreq(freq)}
                                </text>
                            );
                        })}
                        <text
                            x={padding.left + chartWidth / 2}
                            y={height - 3}
                            textAnchor="middle"
                            fill="rgb(161, 161, 170)"
                            style={{ fontSize: "11px" }}
                        >
                            Frequency (Hz)
                        </text>
                    </g>
                )}

                {/* Y-axis labels (dB) */}
                {showLabels && (
                    <g fill="rgb(113, 113, 122)" style={{ fontSize: "10px" }}>
                        {DB_LABELS.map((db) => {
                            const y = padding.top + dbToY(db) * chartHeight;
                            return (
                                <text
                                    key={`db-${db}`}
                                    x={padding.left - 8}
                                    y={y + 3}
                                    textAnchor="end"
                                >
                                    {db}
                                </text>
                            );
                        })}
                        <text
                            x={14}
                            y={padding.top + chartHeight / 2}
                            textAnchor="middle"
                            transform={`rotate(-90, 14, ${padding.top + chartHeight / 2})`}
                            fill="rgb(161, 161, 170)"
                            style={{ fontSize: "11px" }}
                        >
                            Magnitude (dB)
                        </text>
                    </g>
                )}

                {/* Axis lines */}
                <g stroke="rgb(63, 63, 70)" strokeWidth="1">
                    {/* X-axis */}
                    <line
                        x1={padding.left}
                        y1={padding.top + chartHeight}
                        x2={padding.left + chartWidth}
                        y2={padding.top + chartHeight}
                    />
                    {/* Y-axis */}
                    <line
                        x1={padding.left}
                        y1={padding.top}
                        x2={padding.left}
                        y2={padding.top + chartHeight}
                    />
                </g>

                {/* Legend */}
                <g transform={`translate(${padding.left + chartWidth - 160}, ${padding.top + 8})`}>
                    <rect x="0" y="0" width="155" height="68" fill="rgba(0,0,0,0.7)" rx="4" />

                    <line x1="8" y1="14" x2="35" y2="14" stroke="url(#curveGradient)" strokeWidth="2.5" />
                    <text x="42" y="17" fill="rgb(212, 212, 216)" style={{ fontSize: "10px" }}>Frequency Response</text>

                    <line x1="8" y1="30" x2="35" y2="30" stroke="rgb(16, 185, 129)" strokeWidth="2" strokeDasharray="4,4" />
                    <circle cx="21" cy="30" r="4" fill="rgb(16, 185, 129)" stroke="rgb(9, 9, 11)" strokeWidth="1.5" />
                    <text x="42" y="33" fill="rgb(212, 212, 216)" style={{ fontSize: "10px" }}>Octave Bands</text>

                    <line x1="8" y1="46" x2="35" y2="46" stroke="rgb(234, 179, 8)" strokeWidth="1" strokeDasharray="8,4" />
                    <text x="42" y="49" fill="rgb(212, 212, 216)" style={{ fontSize: "10px" }}>Average ({avgMagnitude.toFixed(0)} dB)</text>

                    <line x1="8" y1="62" x2="35" y2="62" stroke="rgb(239, 68, 68)" strokeWidth="1.5" />
                    <text x="42" y="65" fill="rgb(212, 212, 216)" style={{ fontSize: "10px" }}>0 dB Reference</text>
                </g>
            </svg>
        </div>
    );
}
