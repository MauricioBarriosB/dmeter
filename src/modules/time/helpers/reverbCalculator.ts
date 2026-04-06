import type { TimeCalculatedResults, PreDelayOption, DawPreset, TimeConfig, TimeFormData } from "../types";
import { buildTempoGrid, round } from "./tempoGrid";

const envSuggestions: Record<string, string> = {
    hall: "Orchestral recordings, cinematic scores, epic ballads",
    large_hall: "Classical music, film scoring, ambient soundscapes",
    chamber: "Acoustic ensembles, jazz trios, intimate vocal recordings",
    room: "Natural vocal recordings, acoustic guitars, podcast production",
    small_room: "Tight drum sounds, spoken word, close-mic instruments",
    plate: "Classic vocal reverb, snare drums, vintage pop productions",
    spring: "Guitar amps, surf rock, lo-fi vintage effects",
    cathedral: "Choral music, organ recordings, atmospheric pads",
    arena: "Stadium rock, live concert simulations, power ballads",
    warehouse: "Industrial music, EDM builds, experimental sound design",
    bathroom: "Lo-fi vocal effects, creative percussion, indie recordings",
    ambient: "Atmospheric pads, post-rock, soundscapes, meditation music",
};

export function getSuggestedReverbUse(environment: string, trackType: string): string {
    return envSuggestions[environment] ?? `Professional ${trackType} processing`;
}

export function computeReverbDefaults(
    bpm: number, timeSig: string, environment: string, roomSize: number, damping: number,
    config: TimeConfig,
) {
    const ts = config.timeSignatures.find((t) => t.key === timeSig) ?? config.timeSignatures[3];
    const q = 60000 / bpm;
    const beatMs = (q * 4) / ts.unit;
    const barMs = ts.beats * beatMs;

    const barFraction = config.environmentBarFraction[environment] ?? 0.5;
    const sizeFactor = 0.5 + roomSize / 100;
    const dampFactor = 1 - (damping / 100) * 0.35;

    const reverbMs = barMs * barFraction * sizeFactor * dampFactor;
    const reverbTime = round(reverbMs / 1000, 2);
    const preDelay = round(q / 8, 1);

    return { reverbTime, preDelay };
}

export function calculateReverbResults(form: TimeFormData, config: TimeConfig): TimeCalculatedResults {
    const ts = config.timeSignatures.find((t) => t.key === form.timeSignature) ?? config.timeSignatures[3];
    const grid = buildTempoGrid(form.bpm, ts.beats, ts.unit);
    const q = grid.quarterNote;

    const barFraction = config.environmentBarFraction[form.environment] ?? 0.5;
    const sizeFactor = 0.5 + form.roomSize / 100;
    const dampFactor = 1 - (form.damping / 100) * 0.35;
    const rt60 = round(form.reverbTime, 2);
    const rt60Ms = rt60 * 1000;

    const reverbTailBars = round(rt60Ms / grid.barLength, 2);

    const noteMap: [string, number][] = [
        ["1/16 note", grid.sixteenthNote],
        ["1/8 note", grid.eighthNote],
        ["Dotted 1/8", grid.dottedEighth],
        ["1/4 note", q],
        ["Dotted 1/4", grid.dottedQuarter],
        ["1/2 note", grid.halfNote],
        ["Dotted 1/2", grid.dottedHalf],
        ["1 bar", grid.barLength],
        ["2 bars", grid.twoBarLength],
        ["4 bars", grid.fourBarLength],
    ];
    let closestNote = noteMap[0];
    let closestDiff = Math.abs(rt60Ms - noteMap[0][1]);
    for (const entry of noteMap) {
        const diff = Math.abs(rt60Ms - entry[1]);
        if (diff < closestDiff) { closestDiff = diff; closestNote = entry; }
    }

    const earlyReflections = Math.round(5 + (form.roomSize / 100) * 75);
    const lateReverbTail = Math.max(0, Math.round(rt60Ms - earlyReflections));
    const reverbDensity = form.diffusion < 30 ? "sparse" : form.diffusion > 70 ? "dense" : "moderate";

    const preDelaySubdivisions: [string, number][] = [
        ["1/64 note", q / 16],
        ["1/32 note", q / 8],
        ["1/16 note", q / 4],
        ["1/8 note", q / 2],
        ["Dotted 1/16", (q * 3) / 8],
        ["Triplet 1/8", q / 3],
    ];
    const preDelayOptions: PreDelayOption[] = preDelaySubdivisions.map(([sub, ms]) => ({
        subdivision: sub, ms: round(ms, 1), musical: true,
    }));
    preDelayOptions.push({ subdivision: "User setting", ms: form.preDelay, musical: false });
    preDelayOptions.sort((a, b) => a.ms - b.ms);

    const recommendedPreDelay = round(q / 8, 1);
    const recommendedDecayMs = grid.barLength * barFraction * sizeFactor * dampFactor;
    const recommendedDecayTime = Math.round(recommendedDecayMs);

    const [recLowCut, recHighCut] = config.trackReverbEQ[form.trackType] ?? [100, 12000];
    const recWetDry = config.trackWetDry[form.trackType] ?? 20;
    const earlyLateMix = Math.round(30 + (form.roomSize / 100) * 40);
    const freqRange = `${recLowCut} Hz – ${recHighCut >= 1000 ? `${recHighCut / 1000} kHz` : `${recHighCut} Hz`}`;
    const suggestedUse = getSuggestedReverbUse(form.environment, form.trackType);

    const dawPreset: DawPreset = {
        preDelay: recommendedPreDelay, decayTime: rt60, size: form.roomSize,
        damping: form.damping, diffusion: form.diffusion,
        highCut: recHighCut, lowCut: recLowCut, wetDry: recWetDry, earlyLateMix,
    };

    return {
        ...grid, rt60, earlyReflections, lateReverbTail, reverbDensity, reverbTailBars,
        preDelayOptions, recommendedPreDelay, recommendedDecayTime,
        recommendedHighCut: recHighCut, recommendedLowCut: recLowCut,
        recommendedWetDry: recWetDry, recommendedEarlyLateMix: earlyLateMix,
        musicalFitNote: closestNote[0], musicalFitMs: Math.round(closestNote[1]),
        frequencyRange: freqRange, suggestedUse, dawPreset,
    };
}
