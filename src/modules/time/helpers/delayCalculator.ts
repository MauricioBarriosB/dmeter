import type { TimeCalculatedResults, DelayRepeatEntry, DawPreset, TimeConfig, TimeFormData } from "../types";
import { buildTempoGrid, round } from "./tempoGrid";

const delaySuggestions: Record<string, string> = {
    mono: "Slapback effects, vocal thickening, rhythmic patterns",
    stereo: "Wide stereo image, ambient textures, spatial depth",
    pingpong: "Bouncing rhythmic delays, stereo width, electronic music",
    tape: "Warm vintage delay, degrading repeats, classic rock/pop",
    analog: "Dark warm repeats, bucket-brigade emulation, lo-fi textures",
    digital: "Clean precise repeats, modern pop, rhythmic sync delays",
    modulated: "Chorus-like delay, psychedelic effects, ambient washes",
};

export function calculateDelayResults(form: TimeFormData, config: TimeConfig): TimeCalculatedResults {
    const ts = config.timeSignatures.find((t) => t.key === form.timeSignature) ?? config.timeSignatures[3];
    const grid = buildTempoGrid(form.bpm, ts.beats, ts.unit);
    const q = grid.quarterNote;

    const noteConfig = config.noteValues.find((n) => n.key === form.noteValue);
    const delayMs = noteConfig ? Math.round(q * noteConfig.multiplier) : form.delayTime;

    const feedbackRatio = form.feedback / 100;
    const reps = form.repetitions;
    const repeatEntries: DelayRepeatEntry[] = [];
    let amplitude = 1;
    let totalDecay = 0;
    for (let i = 1; i <= reps; i++) {
        amplitude *= feedbackRatio;
        const timeMs = delayMs * i;
        const amplitudeDb = amplitude > 0 ? round(20 * Math.log10(amplitude), 1) : -Infinity;
        repeatEntries.push({
            repeat: i, timeMs: Math.round(timeMs),
            amplitudeDb: isFinite(amplitudeDb) ? amplitudeDb : -96,
            amplitudePct: round(amplitude * 100, 1),
        });
        totalDecay = timeMs;
    }

    const [recLowCut, recHighCut] = config.trackDelayEQ[form.trackType] ?? [200, 10000];
    const recFeedback = config.delayTypeFeedback[form.delayType] ?? 30;
    const freqRange = `${recLowCut} Hz – ${recHighCut >= 1000 ? `${recHighCut / 1000} kHz` : `${recHighCut} Hz`}`;

    const dawPreset: DawPreset = {
        preDelay: 0, decayTime: delayMs, size: 0, damping: 0, diffusion: 0,
        highCut: recHighCut, lowCut: recLowCut,
        wetDry: form.trackType === "master" ? 8 : 20, earlyLateMix: 0,
        delayTimeMs: delayMs, feedback: recFeedback,
        noteSync: noteConfig?.label ?? "Manual",
        stereoSpread: form.delayType === "pingpong" ? form.pingPongSpread : 50,
    };

    return {
        ...grid, delayMs, totalDecayTime: Math.round(totalDecay), repeatEntries,
        recommendedFeedback: recFeedback,
        recommendedDelayHighCut: recHighCut, recommendedDelayLowCut: recLowCut,
        frequencyRange: freqRange,
        suggestedUse: delaySuggestions[form.delayType] ?? "Professional delay processing",
        dawPreset,
    };
}
