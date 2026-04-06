import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Timer, Clock, Repeat, Music, Sliders, Gauge } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, Spinner } from "@heroui/react";
import { fetchTimeReport } from "@services/apiCrud";
import type { TimeReportRecord } from "../types";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import UnauthorizedAlert from "@components/UnauthorizedAlert";
import DetailPageNav from "@components/DetailPageNav";
import LoadErrorCard from "@components/LoadErrorCard";
import PresetBox from "../components/PresetBox";
import MetricBox from "../components/MetricBox";
import ParamRow from "../components/ParamRow";

const formatDate = (isoString: string) => new Date(isoString).toLocaleString();

const formatMs = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.round(ms)}ms`;
};

const formatHz = (hz: number) => (hz >= 1000 ? `${hz / 1000} kHz` : `${hz} Hz`);

export default function DetailTime() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [record, setRecord] = useState<TimeReportRecord | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });
        if (!id) {
            setNotFound(true);
            return;
        }
        fetchTimeReport(id)
            .then((data) => {
                setRecord(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
                if (err.message?.includes("not found") || err.message?.includes("404")) setNotFound(true);
                else setLoadError("Failed to load time report data.");
                setIsLoading(false);
            });
    }, [id]);

    if (isValid === false) return <UnauthorizedAlert />;
    if (isValid === null)
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Loading...</p>
            </div>
        );
    if (notFound)
        return (
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={20} />}
                    onPress={() => navigate("/time")}
                    className="mb-6"
                >
                    Back to Time Calculator
                </Button>
                <Card>
                    <CardBody>
                        <p className="text-center text-default-500 py-8">Report not found. It may have been deleted.</p>
                    </CardBody>
                </Card>
            </div>
        );
    if (isLoading || !record)
        return (
            <div className="flex items-center justify-center min-h-100">
                <Spinner size="lg" />
                <p className="ml-3 text-lg text-default-500">Loading report...</p>
            </div>
        );
    if (loadError) return <LoadErrorCard message={loadError} />;

    const isReverb = record.effectType === "reverb";
    const r = record.calculatedResults;
    const preset = r.dawPreset;

    // Note subdivision table data
    const subdivisions = [
        { name: "Whole Note", symbol: "1/1", ms: r.wholeNote },
        { name: "Dotted Half", symbol: "1/2.", ms: r.dottedHalf },
        { name: "Half Note", symbol: "1/2", ms: r.halfNote },
        { name: "Triplet Half", symbol: "1/2T", ms: r.tripletHalf },
        { name: "Dotted Quarter", symbol: "1/4.", ms: r.dottedQuarter },
        { name: "Quarter Note", symbol: "1/4", ms: r.quarterNote },
        { name: "Triplet Quarter", symbol: "1/4T", ms: r.tripletQuarter },
        { name: "Dotted Eighth", symbol: "1/8.", ms: r.dottedEighth },
        { name: "Eighth Note", symbol: "1/8", ms: r.eighthNote },
        { name: "Triplet Eighth", symbol: "1/8T", ms: r.tripletEighth },
        { name: "Dotted Sixteenth", symbol: "1/16.", ms: r.dottedSixteenth },
        { name: "Sixteenth Note", symbol: "1/16", ms: r.sixteenthNote },
        { name: "Triplet Sixteenth", symbol: "1/16T", ms: r.tripletSixteenth },
        { name: "Thirty-Second", symbol: "1/32", ms: r.thirtySecondNote },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <DetailPageNav
                    backLabel="Back to Time Calculator"
                    backUrl="/time"
                    editUrl={`/time?edit=${id}`}
                    variant="light"
                    className="flex gap-2 mb-4"
                />
                <div className="flex items-center gap-3 mb-3">
                    <Timer size={40} className="text-primary" />
                    <div>
                        <h1
                            className="text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {record.reportName}
                        </h1>
                        <p className="text-lg text-default-500">{isReverb ? "Reverb" : "Delay"} Time Report</p>
                    </div>
                </div>
                <p className="text-lg text-default-600">{formatDate(record.createdAt)}</p>
            </div>

            {/* SUMMARY CARD */}

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Music size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold">Session Info</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                        <div>
                            <p className="text-sm text-default-500 mb-2">Track</p>
                            <Chip color="primary" size="lg">
                                {record.trackTypeLabel}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Effect</p>
                            <Chip color={isReverb ? "secondary" : "warning"} size="lg">
                                {record.effectTypeLabel}
                            </Chip>
                        </div>
                        {isReverb && (
                            <div>
                                <p className="text-sm text-default-500 mb-2">Environment</p>
                                <Chip color="secondary" size="lg">
                                    {record.environmentLabel}
                                </Chip>
                            </div>
                        )}
                        {!isReverb && (
                            <div>
                                <p className="text-sm text-default-500 mb-2">Delay Type</p>
                                <Chip color="warning" size="lg">
                                    {record.delayTypeLabel}
                                </Chip>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-default-500 mb-2">Time Sig.</p>
                            <Chip color="default" size="lg">
                                {record.timeSignature}
                            </Chip>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">BPM</p>
                            <p className="text-2xl font-bold font-mono">{record.bpm}</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">Beat ({record.timeSignature})</p>
                            <p className="text-2xl font-bold font-mono">{Math.round(r.beatMs)}ms</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">1/4 Note</p>
                            <p className="text-2xl font-bold font-mono">{Math.round(r.quarterNote)}ms</p>
                        </div>
                        <div>
                            <p className="text-sm text-default-500 mb-2">1 Bar ({record.timeSignature})</p>
                            <p className="text-2xl font-bold font-mono">{formatMs(r.barLength)}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* DAW PRESET CARD — the key deliverable */}

            <Card className="mb-6 border-2 border-primary/30">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sliders size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold">DAW Plugin Preset — Ready to Use</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    {isReverb ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <PresetBox label="Pre-Delay" value={`${preset.preDelay}ms`} sub="1/32 note synced" />
                            <PresetBox
                                label="Decay Time"
                                value={`${preset.decayTime}s`}
                                sub={`≈ ${r.reverbTailBars} bars (${record.timeSignature})`}
                            />
                            <PresetBox
                                label="Room Size"
                                value={`${preset.size}%`}
                                sub={record.environmentLabel ?? ""}
                            />
                            <PresetBox label="Damping" value={`${preset.damping}%`} sub="HF absorption" />
                            <PresetBox label="Diffusion" value={`${preset.diffusion}%`} sub={r.reverbDensity ?? ""} />
                            <PresetBox label="High Cut" value={formatHz(preset.highCut)} sub="Low-pass on reverb" />
                            <PresetBox label="Low Cut" value={formatHz(preset.lowCut)} sub="High-pass on reverb" />
                            <PresetBox
                                label="Wet/Dry"
                                value={`${preset.wetDry}%`}
                                sub={`Rec. for ${record.trackTypeLabel}`}
                            />
                            <PresetBox label="Early/Late" value={`${preset.earlyLateMix}%`} sub="Late reflections" />
                            <PresetBox
                                label="Musical Fit"
                                value={r.musicalFitNote ?? "—"}
                                sub={`${r.musicalFitMs}ms`}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <PresetBox
                                label="Delay Time"
                                value={`${preset.delayTimeMs}ms`}
                                sub={preset.noteSync ?? ""}
                            />
                            <PresetBox
                                label="Feedback"
                                value={`${preset.feedback}%`}
                                sub={`Rec. for ${record.delayTypeLabel}`}
                            />
                            <PresetBox
                                label="Repetitions"
                                value={`${record.repetitions}`}
                                sub={`Total: ${formatMs(r.totalDecayTime ?? 0)}`}
                            />
                            <PresetBox
                                label="High Cut"
                                value={formatHz(preset.highCut)}
                                sub={`Rec. for ${record.trackTypeLabel}`}
                            />
                            <PresetBox
                                label="Low Cut"
                                value={formatHz(preset.lowCut)}
                                sub={`Rec. for ${record.trackTypeLabel}`}
                            />
                            <PresetBox
                                label="Wet/Dry"
                                value={`${preset.wetDry}%`}
                                sub={`Rec. for ${record.trackTypeLabel}`}
                            />
                            <PresetBox
                                label="Stereo Spread"
                                value={`${preset.stereoSpread}%`}
                                sub={record.delayTypeLabel ?? ""}
                            />
                            <PresetBox
                                label="Note Sync"
                                value={preset.noteSync ?? "Manual"}
                                sub={`${preset.delayTimeMs}ms`}
                            />
                            {record.delayType === "pingpong" && (
                                <PresetBox label="Ping Pong" value={`${record.pingPongSpread}%`} sub="L/R spread" />
                            )}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* REVERB: Calculated Analysis + Pre-Delay Options */}

            {isReverb && (
                <>
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Gauge size={20} className="text-secondary" />
                                <h2 className="text-xl font-semibold">Reverb Analysis at {record.bpm} BPM</h2>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                                <MetricBox color="secondary" label="RT60" value={`${r.rt60}s`} sub="Reverb decay" />
                                <MetricBox
                                    color="primary"
                                    label="Early Reflections"
                                    value={`${r.earlyReflections}ms`}
                                    sub="Initial bounces"
                                />
                                <MetricBox
                                    color="warning"
                                    label="Late Tail"
                                    value={formatMs(r.lateReverbTail ?? 0)}
                                    sub="Diffuse field"
                                />
                                <MetricBox
                                    color="success"
                                    label="Rec. Pre-Delay"
                                    value={`${r.recommendedPreDelay}ms`}
                                    sub="1/32 note"
                                />
                                <MetricBox
                                    color="danger"
                                    label="Max Decay"
                                    value={formatMs(r.recommendedDecayTime ?? 0)}
                                    sub="Clear before next bar"
                                />
                                <MetricBox
                                    color="default"
                                    label="Tail Length"
                                    value={`${r.reverbTailBars} bars`}
                                    sub={`${record.timeSignature} at ${record.bpm} BPM`}
                                />
                            </div>
                            <div className="p-4 rounded-lg bg-default-50 border border-default-200">
                                <p className="text-sm font-semibold text-default-700 mb-1">Suggested Use</p>
                                <p className="text-default-600">{r.suggestedUse}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* BPM-Synced Pre-Delay Options */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-success" />
                                <h2 className="text-xl font-semibold">BPM-Synced Pre-Delay Options</h2>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <p className="text-sm text-default-500 mb-4">
                                Pre-delay separates the dry signal from the reverb onset. Using a BPM-synced value keeps
                                the reverb rhythmically locked to the session.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-default-200">
                                            <th className="text-left p-3 font-semibold">Subdivision</th>
                                            <th className="text-center p-3 font-semibold">Time (ms)</th>
                                            <th className="text-center p-3 font-semibold">Type</th>
                                            <th className="text-left p-3 font-semibold">Recommendation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(r.preDelayOptions ?? []).map((opt) => {
                                            const isRec = opt.ms === r.recommendedPreDelay && opt.musical;
                                            let recLabel: string;
                                            if (isRec) {
                                                recLabel =
                                                    "★ Recommended — keeps transient clear while staying in time";
                                            } else if (opt.musical) {
                                                recLabel = "Musical option";
                                            } else {
                                                recLabel = `Your setting: ${opt.ms}ms`;
                                            }
                                            return (
                                                <tr
                                                    key={`${opt.ms}-${opt.subdivision}`}
                                                    className={`border-b border-default-100 ${isRec ? "bg-success/5" : "hover:bg-default-50"}`}
                                                >
                                                    <td className="p-3 font-medium">{opt.subdivision}</td>
                                                    <td className="p-3 text-center font-mono">{opt.ms}</td>
                                                    <td className="p-3 text-center">
                                                        <Chip
                                                            size="sm"
                                                            variant="flat"
                                                            color={opt.musical ? "success" : "default"}
                                                        >
                                                            {opt.musical ? "BPM Synced" : "Manual"}
                                                        </Chip>
                                                    </td>
                                                    <td className="p-3 text-sm text-default-600">{recLabel}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>

                    {/* User Parameters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">User Input Parameters</h2>
                        </CardHeader>
                        <CardBody>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-default-200">
                                            <th className="text-left p-3 font-semibold">Parameter</th>
                                            <th className="text-center p-3 font-semibold">Your Value</th>
                                            <th className="text-center p-3 font-semibold">Recommended</th>
                                            <th className="text-left p-3 font-semibold">Why</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ParamRow
                                            label="Pre-Delay"
                                            user={`${record.preDelay}ms`}
                                            rec={`${r.recommendedPreDelay}ms`}
                                            why="1/32 note keeps transient clarity while staying locked to grid"
                                        />
                                        <ParamRow
                                            label="High Cut"
                                            user={`${record.highCut ?? "—"}`}
                                            rec={formatHz(r.recommendedHighCut ?? 8000)}
                                            why={`Filters mud from ${record.trackTypeLabel} reverb tail`}
                                        />
                                        <ParamRow
                                            label="Low Cut"
                                            user={`${record.lowCut ?? "—"}`}
                                            rec={formatHz(r.recommendedLowCut ?? 200)}
                                            why={`Prevents low-end buildup on ${record.trackTypeLabel}`}
                                        />
                                        <ParamRow
                                            label="Wet/Dry"
                                            user={`${record.wetDryMix}%`}
                                            rec={`${r.recommendedWetDry}%`}
                                            why={`Starting point for ${record.trackTypeLabel} — adjust to taste`}
                                        />
                                        <ParamRow
                                            label="Damping"
                                            user={`${record.damping}%`}
                                            rec="40%"
                                            why="Moderate HF absorption for natural-sounding decay"
                                        />
                                        <ParamRow
                                            label="Diffusion"
                                            user={`${record.diffusion}%`}
                                            rec="60%"
                                            why="Balanced reflection density — not metallic, not muddy"
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </>
            )}

            {/* DELAY: Calculated Analysis + Per-Repeat Decay */}

            {!isReverb && (
                <>
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Repeat size={20} className="text-warning" />
                                <h2 className="text-xl font-semibold">Delay Analysis at {record.bpm} BPM</h2>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                <MetricBox
                                    color="warning"
                                    label="Delay Time"
                                    value={`${r.delayMs}ms`}
                                    sub={record.noteValueLabel ?? ""}
                                />
                                <MetricBox
                                    color="danger"
                                    label="Total Decay"
                                    value={formatMs(r.totalDecayTime ?? 0)}
                                    sub={`${record.repetitions} repeats`}
                                />
                                <MetricBox
                                    color="success"
                                    label="Rec. Feedback"
                                    value={`${r.recommendedFeedback}%`}
                                    sub={`For ${record.delayTypeLabel}`}
                                />
                                <MetricBox
                                    color="primary"
                                    label="Rec. High Cut"
                                    value={formatHz(r.recommendedDelayHighCut ?? 8000)}
                                    sub={`For ${record.trackTypeLabel}`}
                                />
                                <MetricBox
                                    color="secondary"
                                    label="Rec. Low Cut"
                                    value={formatHz(r.recommendedDelayLowCut ?? 200)}
                                    sub={`For ${record.trackTypeLabel}`}
                                />
                            </div>
                            <div className="p-4 rounded-lg bg-default-50 border border-default-200">
                                <p className="text-sm font-semibold text-default-700 mb-1">Suggested Use</p>
                                <p className="text-default-600">{r.suggestedUse}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Per-Repeat Decay Table */}
                    <Card className="mb-6">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Per-Repeat Decay Analysis</h2>
                        </CardHeader>
                        <CardBody>
                            <p className="text-sm text-default-500 mb-4">
                                Each repeat loses amplitude based on {record.feedback}% feedback. Repeats below -40 dB
                                are generally inaudible in a mix.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-default-200">
                                            <th className="text-center p-3 font-semibold">#</th>
                                            <th className="text-center p-3 font-semibold">Time (ms)</th>
                                            <th className="text-center p-3 font-semibold">Time (s)</th>
                                            <th className="text-center p-3 font-semibold">Level (dB)</th>
                                            <th className="text-center p-3 font-semibold">Level (%)</th>
                                            <th className="text-left p-3 font-semibold">Audibility</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(r.repeatEntries ?? []).map((entry) => {
                                            const audible = entry.amplitudeDb > -40;
                                            const isHighAmplitude = entry.amplitudeDb > -12;
                                            const isMidAmplitude = entry.amplitudeDb > -24;
                                            const isLowAmplitude = entry.amplitudeDb > -40;

                                            let color: "success" | "warning" | "danger" | "default";
                                            if (isHighAmplitude) {
                                                color = "success";
                                            } else if (isMidAmplitude) {
                                                color = "warning";
                                            } else if (isLowAmplitude) {
                                                color = "danger";
                                            } else {
                                                color = "default";
                                            }
                                            return (
                                                <tr
                                                    key={entry.repeat}
                                                    className="border-b border-default-100 hover:bg-default-50"
                                                >
                                                    <td className="p-3 text-center font-mono">{entry.repeat}</td>
                                                    <td className="p-3 text-center font-mono">{entry.timeMs}</td>
                                                    <td className="p-3 text-center font-mono">
                                                        {(entry.timeMs / 1000).toFixed(3)}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Chip size="sm" variant="flat" color={color}>
                                                            {entry.amplitudeDb} dB
                                                        </Chip>
                                                    </td>
                                                    <td className="p-3 text-center font-mono">{entry.amplitudePct}%</td>
                                                    <td className="p-3 text-sm text-default-600">
                                                        {audible ? "Audible in mix" : "Below noise floor"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>

                    {/* User Parameters vs Recommended */}
                    <Card className="mb-6">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">User Input vs Recommended</h2>
                        </CardHeader>
                        <CardBody>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-default-200">
                                            <th className="text-left p-3 font-semibold">Parameter</th>
                                            <th className="text-center p-3 font-semibold">Your Value</th>
                                            <th className="text-center p-3 font-semibold">Recommended</th>
                                            <th className="text-left p-3 font-semibold">Why</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ParamRow
                                            label="Feedback"
                                            user={`${record.feedback}%`}
                                            rec={`${r.recommendedFeedback}%`}
                                            why={`Sweet spot for ${record.delayTypeLabel} — avoids self-oscillation`}
                                        />
                                        <ParamRow
                                            label="High Cut"
                                            user={`${record.highCut} Hz`}
                                            rec={formatHz(r.recommendedDelayHighCut ?? 8000)}
                                            why={`Darkens repeats naturally for ${record.trackTypeLabel}`}
                                        />
                                        <ParamRow
                                            label="Low Cut"
                                            user={`${record.lowCut} Hz`}
                                            rec={formatHz(r.recommendedDelayLowCut ?? 200)}
                                            why={`Prevents low-end mud on ${record.trackTypeLabel} repeats`}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </>
            )}

            {/* FULL TEMPO GRID — always shown */}

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Complete Note Subdivision Table — {record.bpm} BPM</h2>
                </CardHeader>
                <CardBody>
                    <p className="text-sm text-default-500 mb-4">
                        Use these values to set any BPM-synced parameter in your DAW: delay times, LFO rates, sidechain
                        release, reverb pre-delay, compressor attack/release.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-default-200">
                                    <th className="text-left p-3 font-semibold">Note</th>
                                    <th className="text-center p-3 font-semibold">Symbol</th>
                                    <th className="text-center p-3 font-semibold">ms</th>
                                    <th className="text-center p-3 font-semibold">Seconds</th>
                                    <th className="text-center p-3 font-semibold">Hz (LFO)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subdivisions.map((s) => (
                                    <tr key={s.symbol} className="border-b border-default-100 hover:bg-default-50">
                                        <td className="p-3 font-medium">{s.name}</td>
                                        <td className="p-3 text-center">
                                            <Chip size="sm" variant="flat" color="primary">
                                                {s.symbol}
                                            </Chip>
                                        </td>
                                        <td className="p-3 text-center font-mono">{Math.round(s.ms)}</td>
                                        <td className="p-3 text-center font-mono">{(s.ms / 1000).toFixed(3)}</td>
                                        <td className="p-3 text-center font-mono">{(1000 / s.ms).toFixed(3)}</td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-default-300 bg-default-50">
                                    <td className="p-3 font-semibold">1 Bar</td>
                                    <td className="p-3 text-center">
                                        <Chip size="sm" variant="flat" color="secondary">
                                            {record.timeSignature}
                                        </Chip>
                                    </td>
                                    <td className="p-3 text-center font-mono">{Math.round(r.barLength)}</td>
                                    <td className="p-3 text-center font-mono">{(r.barLength / 1000).toFixed(3)}</td>
                                    <td className="p-3 text-center font-mono">{(1000 / r.barLength).toFixed(4)}</td>
                                </tr>
                                <tr className="bg-default-50">
                                    <td className="p-3 font-semibold">2 Bars</td>
                                    <td className="p-3 text-center">
                                        <Chip size="sm" variant="flat" color="secondary">
                                            {record.timeSignature}
                                        </Chip>
                                    </td>
                                    <td className="p-3 text-center font-mono">{Math.round(r.twoBarLength)}</td>
                                    <td className="p-3 text-center font-mono">{(r.twoBarLength / 1000).toFixed(3)}</td>
                                    <td className="p-3 text-center font-mono">{(1000 / r.twoBarLength).toFixed(4)}</td>
                                </tr>
                                <tr className="bg-default-50">
                                    <td className="p-3 font-semibold">4 Bars</td>
                                    <td className="p-3 text-center">
                                        <Chip size="sm" variant="flat" color="secondary">
                                            {record.timeSignature}
                                        </Chip>
                                    </td>
                                    <td className="p-3 text-center font-mono">{Math.round(r.fourBarLength)}</td>
                                    <td className="p-3 text-center font-mono">{(r.fourBarLength / 1000).toFixed(3)}</td>
                                    <td className="p-3 text-center font-mono">{(1000 / r.fourBarLength).toFixed(4)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* LEGEND */}

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Legend</h2>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isReverb ? (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-2">RT60 (Reverberation Time)</h3>
                                    <p className="text-sm text-default-500 mb-2">
                                        Time for sound to decay by 60 dB. The tail should ideally fit within 1–2 bars to
                                        avoid muddying the next phrase.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Chip size="sm" color="success" variant="flat">
                                            0.2–0.5s Tight
                                        </Chip>
                                        <Chip size="sm" color="warning" variant="flat">
                                            0.5–1.5s Room
                                        </Chip>
                                        <Chip size="sm" color="danger" variant="flat">
                                            1.5–3s Hall
                                        </Chip>
                                        <Chip size="sm" color="secondary" variant="flat">
                                            3s+ Cathedral
                                        </Chip>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Pre-Delay & BPM Sync</h3>
                                    <p className="text-sm text-default-500 mb-2">
                                        Syncing pre-delay to a note subdivision (1/32, 1/64) keeps the reverb
                                        rhythmically in time and preserves transient clarity.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Chip size="sm" color="success" variant="flat">
                                            1/64 – Tight
                                        </Chip>
                                        <Chip size="sm" color="warning" variant="flat">
                                            1/32 – Natural
                                        </Chip>
                                        <Chip size="sm" color="danger" variant="flat">
                                            1/16 – Separated
                                        </Chip>
                                        <Chip size="sm" color="default" variant="flat">
                                            1/8+ – Effect
                                        </Chip>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-2">Tempo-Synced Delay</h3>
                                    <p className="text-sm text-default-500 mb-2">
                                        Setting delay to a note value ensures repeats land on musical beats. Dotted 1/8
                                        is the most popular choice for modern music.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Chip size="sm" color="success" variant="flat">
                                            1/8. — Most popular
                                        </Chip>
                                        <Chip size="sm" color="warning" variant="flat">
                                            1/4 — Standard
                                        </Chip>
                                        <Chip size="sm" color="danger" variant="flat">
                                            1/4T — Shuffle
                                        </Chip>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Feedback & Repeat Decay</h3>
                                    <p className="text-sm text-default-500 mb-2">
                                        Each repeat loses amplitude by the feedback %. Repeats below -40 dB are
                                        inaudible. Higher feedback creates longer, more ambient tails.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Chip size="sm" color="success" variant="flat">
                                            &gt; -12 dB Loud
                                        </Chip>
                                        <Chip size="sm" color="warning" variant="flat">
                                            -12 to -24 dB Present
                                        </Chip>
                                        <Chip size="sm" color="danger" variant="flat">
                                            -24 to -40 dB Fading
                                        </Chip>
                                        <Chip size="sm" color="default" variant="flat">
                                            &lt; -40 dB Inaudible
                                        </Chip>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>

            <DetailPageNav
                backLabel="Back to Time Calculator"
                backUrl="/time"
                editUrl={`/time?edit=${id}`}
                variant="flat"
                className="flex gap-4 justify-center pt-4"
            />
        </div>
    );
}
