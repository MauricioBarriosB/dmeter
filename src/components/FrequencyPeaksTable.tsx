import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { formatFrequency, getDbColor, type FrequencyPeak } from "../helpers/spectrumPeaksHelper";

interface FrequencyPeaksTableProps {
    spectrumPeaks: FrequencyPeak[];
}

export default function FrequencyPeaksTable({ spectrumPeaks }: FrequencyPeaksTableProps) {
    if (!spectrumPeaks || spectrumPeaks.length === 0) {
        return null;
    }

    const maxAmplitude = spectrumPeaks[0]?.amplitude ?? -100;

    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold">
                    All {spectrumPeaks.length} Frequency Peaks (Maximum Spectrum Values)
                </h2>
            </CardHeader>
            <CardBody>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-default-200">
                                <th className="text-left p-3 font-semibold">#</th>
                                <th className="text-left p-3 font-semibold">Frequency</th>
                                <th className="text-left p-3 font-semibold">Amplitude</th>
                                <th className="text-left p-3 font-semibold">Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spectrumPeaks.map((peak, index) => (
                                <tr key={index} className="border-b border-default-100 hover:bg-default-50">
                                    <td className="p-3 text-default-500">{index + 1}</td>
                                    <td className="p-3 font-medium">{formatFrequency(peak.frequency)}</td>
                                    <td className="p-3">
                                        <Chip size="sm" color={getDbColor(peak.amplitude)} variant="flat">
                                            {peak.amplitude} dB
                                        </Chip>
                                    </td>
                                    <td className="p-3">
                                        <div className="w-32 h-3 bg-default-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.max(0, ((peak.amplitude + 100) / (maxAmplitude + 100)) * 100)}%`,
                                                    background: `hsl(${120 - (peak.amplitude + 100) * 1.2}, 70%, 50%)`,
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
