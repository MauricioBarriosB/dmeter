export function buildTempoGrid(bpm: number, beats: number, unit: number) {
    const q = 60000 / bpm;
    const beatMs = (q * 4) / unit;
    const bar = beats * beatMs;
    return {
        wholeNote: q * 4,
        halfNote: q * 2,
        quarterNote: q,
        eighthNote: q / 2,
        sixteenthNote: q / 4,
        thirtySecondNote: q / 8,
        dottedHalf: q * 3,
        dottedQuarter: (q * 3) / 2,
        dottedEighth: (q * 3) / 4,
        dottedSixteenth: (q * 3) / 8,
        tripletHalf: (q * 4) / 3,
        tripletQuarter: (q * 2) / 3,
        tripletEighth: q / 3,
        tripletSixteenth: q / 6,
        barLength: bar,
        twoBarLength: bar * 2,
        fourBarLength: bar * 4,
        beatsPerBar: beats,
        beatUnit: unit,
        beatMs,
    };
}

export function round(v: number, d: number = 1): number {
    const f = Math.pow(10, d);
    return Math.round(v * f) / f;
}
