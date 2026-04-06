import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Input,
    Select,
    SelectItem,
    Spinner,
    useDisclosure,
} from "@heroui/react";
import { fetchFromApi } from "@services/apiConfig";
import { buildTempoGrid, round } from "../helpers/tempoGrid";
import type { TimeData, SubdivisionEntry } from "../types";

interface DelayRow {
    key: string;
    label: string;
    ms: number;
    seconds: string;
    hz: string;
    common: boolean;
}

function buildDelayRows(
    bpm: number,
    beats: number,
    unit: number,
    subdivisions: SubdivisionEntry[],
): DelayRow[] {
    const grid = buildTempoGrid(bpm, beats, unit);
    const gridMap: Record<string, number> = {
        ...grid,
        sixtyFourthNote: grid.quarterNote / 16,
    };

    return subdivisions.map((sub) => {
        const ms = gridMap[sub.gridKey] ?? 0;
        return {
            key: sub.key,
            label: sub.label,
            ms: round(ms, 1),
            seconds: round(ms / 1000, 3).toFixed(3),
            hz: ms > 0 ? round(1000 / ms, 2).toString() : "—",
            common: sub.common,
        };
    });
}

export default function DelayTableModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [timeData, setTimeData] = useState<TimeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bpm, setBpm] = useState(125);
    const [timeSigKey, setTimeSigKey] = useState("6/4");

    useEffect(() => {
        if (isOpen && !timeData) {
            setIsLoading(true);
            fetchFromApi<TimeData>("time-data")
                .then((data) => {
                    setTimeData(data);
                    setBpm(data.defaults.bpm);
                    setTimeSigKey(data.defaults.timeSignature);
                })
                .catch((err) => console.error("Failed to load time data:", err))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, timeData]);

    const ts = timeData?.timeSignatures.find((t) => t.key === timeSigKey) ?? { beats: 4, unit: 4 };
    const rows = timeData ? buildDelayRows(bpm, ts.beats, ts.unit, timeData.delaySubdivisions) : [];

    return (
        <>
            <Button
                onPress={onOpen}
                color="warning"
                variant="flat"
                className="mt-4"
                startContent={<Clock size={18} />}
            >
                Delay Times Table
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex items-center gap-2">
                                <Clock size={20} className="text-warning" />
                                Delay Times Table
                            </ModalHeader>
                            <ModalBody className="pb-6">
                                <p className="text-sm text-default-500 mb-4">
                                    Enter your project BPM and time signature to generate tempo-synced delay timing values.
                                    The table displays each note subdivision as milliseconds, seconds, and frequency (Hz) for
                                    LFO sync — use these to set delay time, tap tempo, and modulation rates in your DAW.
                                    Values tagged as <strong>Common</strong> are the most frequently used in professional mixing.
                                </p>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Spinner size="lg" color="warning" />
                                    </div>
                                ) : timeData ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <Input
                                                type="number"
                                                label="BPM"
                                                value={bpm.toString()}
                                                onValueChange={(v) => setBpm(Number(v) || 120)}
                                                min={20}
                                                max={300}
                                            />
                                            <Select
                                                label="Time Signature"
                                                selectedKeys={[timeSigKey]}
                                                onSelectionChange={(k) => setTimeSigKey((Array.from(k)[0] as string) || "4/4")}
                                            >
                                                {timeData.timeSignatures.map((o) => (
                                                    <SelectItem key={o.key}>{o.label}</SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <Table aria-label="Delay timing values" isStriped>
                                            <TableHeader>
                                                <TableColumn>Subdivision</TableColumn>
                                                <TableColumn>Time (ms)</TableColumn>
                                                <TableColumn>Time (s)</TableColumn>
                                                <TableColumn>Freq (Hz)</TableColumn>
                                                <TableColumn>Common</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow key={row.key}>
                                                        <TableCell className="font-medium">{row.label}</TableCell>
                                                        <TableCell>{row.ms}</TableCell>
                                                        <TableCell>{row.seconds}</TableCell>
                                                        <TableCell>{row.hz}</TableCell>
                                                        <TableCell>
                                                            {row.common && (
                                                                <Chip size="sm" color="warning" variant="flat">Common</Chip>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </>
                                ) : (
                                    <p className="text-center text-default-500 py-8">Failed to load data.</p>
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
