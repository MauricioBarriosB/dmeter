import { AudioLines } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import FrequencyResponseChart from "../audio/FrequencyResponseChart";
import type { FrequencyBandData } from "../../helpers/audioStorage";

interface FrequencyResponseCardProps {
    octaveBands: { frequency: number; magnitude: number }[];
    thirdOctaveBands: { frequency: number; magnitude: number }[];
    spectrumData: FrequencyBandData[];
    height?: number;
    title?: string;
    className?: string;
}

export default function FrequencyResponseCard({
    octaveBands,
    thirdOctaveBands,
    spectrumData,
    height = 380,
    title = "Frequency Response (20Hz - 20kHz)",
    className = "mb-6",
}: Readonly<FrequencyResponseCardProps>) {
    return (
        <Card className={className}>
            <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AudioLines size={24} className="text-primary" />
                    Frequency Response Curve
                </h2>
            </CardHeader>
            <CardBody>
                <p className="text-sm text-default-500 mb-4">
                    Full spectrum frequency response from 20Hz to 20kHz. The curve shows the average energy distribution
                    across the audible spectrum with logarithmic frequency scale.
                </p>
                <FrequencyResponseChart
                    octaveBands={octaveBands}
                    thirdOctaveBands={thirdOctaveBands}
                    spectrumData={spectrumData}
                    height={height}
                    title={title}
                />
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <p className="text-xs text-purple-400">Low Frequencies</p>
                        <p className="text-sm font-semibold">20Hz - 250Hz</p>
                        <p className="text-xs text-default-400">Sub-bass & Bass</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-xs text-green-400">Mid Frequencies</p>
                        <p className="text-sm font-semibold">250Hz - 4kHz</p>
                        <p className="text-xs text-default-400">Vocals & Instruments</p>
                    </div>
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <p className="text-xs text-orange-400">High Frequencies</p>
                        <p className="text-sm font-semibold">4kHz - 20kHz</p>
                        <p className="text-xs text-default-400">Presence & Air</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
