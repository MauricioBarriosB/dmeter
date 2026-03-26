import { Card, CardBody, CardHeader, Chip, Progress } from "@heroui/react";
import { formatFrequency, getDbColor, type FrequencyPeak } from "../../helpers/spectrumPeaksHelper";

interface FrequencyPeaksTableProps {
    spectrumPeaks: FrequencyPeak[];
}

const getLevelColor = (amplitude: number): "danger" | "warning" | "success" => {
    if (amplitude >= -10) return "danger";
    if (amplitude >= -30) return "warning";
    return "success";
};

export default function FrequencyPeaksTable({ spectrumPeaks }: Readonly<FrequencyPeaksTableProps>) {
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
                                    <td className="p-3 w-32">
                                        <Progress
                                            value={Math.max(0, ((peak.amplitude + 100) / (maxAmplitude + 100)) * 100)}
                                            color={getLevelColor(peak.amplitude)}
                                            size="sm"
                                        />
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
