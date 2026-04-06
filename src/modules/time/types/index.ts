// ============================================================================
// Config types (used by helpers and pages)
// ============================================================================

export interface KeyLabel {
    key: string;
    label: string;
}

export interface NoteValueOption extends KeyLabel {
    multiplier: number;
}

export interface TimeSignatureOption extends KeyLabel {
    beats: number;
    unit: number;
}

export interface TimeConfig {
    trackTypes: KeyLabel[];
    effectTypes: KeyLabel[];
    environments: KeyLabel[];
    noteValues: NoteValueOption[];
    timeSignatures: TimeSignatureOption[];
    delayTypes: KeyLabel[];
    environmentBarFraction: Record<string, number>;
    trackReverbEQ: Record<string, [number, number]>;
    trackWetDry: Record<string, number>;
    trackDelayEQ: Record<string, [number, number]>;
    delayTypeFeedback: Record<string, number>;
}

// ============================================================================
// Form state
// ============================================================================

export interface TimeFormData {
    reportName: string;
    trackType: string;
    effectType: "reverb" | "delay" | "";
    bpm: number;
    timeSignature: string;
    reverbTime: number;
    preDelay: number;
    roomSize: number;
    environment: string;
    damping: number;
    diffusion: number;
    wetDryMix: number;
    delayTime: number;
    noteValue: string;
    feedback: number;
    repetitions: number;
    delayType: string;
    pingPongSpread: number;
    highCut: number;
    lowCut: number;
}

export const initialFormData: TimeFormData = {
    reportName: "", trackType: "", effectType: "", bpm: 120, timeSignature: "4/4",
    reverbTime: 1.5, preDelay: 20, roomSize: 50, environment: "",
    damping: 40, diffusion: 60, wetDryMix: 30,
    delayTime: 500, noteValue: "quarter", feedback: 40, repetitions: 4,
    delayType: "stereo", pingPongSpread: 80, highCut: 8000, lowCut: 200,
};

// ============================================================================
// Report record
// ============================================================================

// Time (Reverb & Delay) Report Record
export interface TimeReportRecord {
    id: string;
    reportName: string;
    trackType: string;
    trackTypeLabel: string;
    effectType: "reverb" | "delay";
    effectTypeLabel: string;
    bpm: number;
    timeSignature: string;       // "4/4", "3/4", "6/8", etc.
    timeSignatureBeats: number;  // numerator (e.g. 4)
    timeSignatureUnit: number;   // denominator (e.g. 4)
    // Reverb-specific fields
    reverbTime?: number;
    preDelay?: number;
    roomSize?: number;
    environment?: string;
    environmentLabel?: string;
    damping?: number;
    diffusion?: number;
    wetDryMix?: number;
    // Delay-specific fields
    delayTime?: number;
    noteValue?: string;
    noteValueLabel?: string;
    feedback?: number;
    repetitions?: number;
    delayType?: string;
    delayTypeLabel?: string;
    pingPongSpread?: number;
    highCut?: number;
    lowCut?: number;
    // Calculated results
    calculatedResults: TimeCalculatedResults;
    createdAt: string;
}

// BPM-synced pre-delay option
export interface PreDelayOption {
    subdivision: string;   // "1/64 note", "1/32 note", etc.
    ms: number;
    musical: boolean;      // whether it lands on a clean subdivision
}

// Per-repeat decay entry for delay
export interface DelayRepeatEntry {
    repeat: number;
    timeMs: number;        // absolute time from original signal
    amplitudeDb: number;   // level in dB relative to dry
    amplitudePct: number;  // level as percentage
}

// Full note subdivision entry
export interface NoteSubdivision {
    name: string;
    symbol: string;        // "1/4", "1/8.", "1/4T" etc.
    ms: number;
    seconds: number;
    hz: number;            // frequency equivalent (for LFO sync)
}

export interface TimeCalculatedResults {
    // ── Tempo Grid ──
    wholeNote: number;
    halfNote: number;
    quarterNote: number;
    eighthNote: number;
    sixteenthNote: number;
    thirtySecondNote: number;
    dottedHalf: number;
    dottedQuarter: number;
    dottedEighth: number;
    dottedSixteenth: number;
    tripletHalf: number;
    tripletQuarter: number;
    tripletEighth: number;
    tripletSixteenth: number;
    barLength: number;     // 1 bar in ms based on time signature
    twoBarLength: number;
    fourBarLength: number;
    beatsPerBar: number;   // from time signature numerator
    beatUnit: number;      // from time signature denominator
    beatMs: number;        // duration of one beat in the time signature

    // ── Reverb-specific ──
    rt60?: number;
    earlyReflections?: number;
    lateReverbTail?: number;
    reverbDensity?: string;
    reverbTailBars?: number;            // how many bars the tail spans
    preDelayOptions?: PreDelayOption[];  // BPM-synced pre-delay choices
    recommendedPreDelay?: number;
    recommendedDecayTime?: number;       // ms — reverb should end before this
    recommendedHighCut?: number;         // Hz
    recommendedLowCut?: number;          // Hz
    recommendedWetDry?: number;          // percentage
    recommendedEarlyLateMix?: number;    // percentage early vs late
    musicalFitNote?: string;             // which note value the RT60 fits closest to
    musicalFitMs?: number;

    // ── Delay-specific ──
    delayMs?: number;
    totalDecayTime?: number;
    repeatEntries?: DelayRepeatEntry[];
    recommendedFeedback?: number;
    recommendedDelayHighCut?: number;
    recommendedDelayLowCut?: number;

    // ── Common ──
    frequencyRange: string;
    suggestedUse: string;
    dawPreset: DawPreset;
}

// Ready-to-use DAW plugin preset values
export interface DawPreset {
    preDelay: number;
    decayTime: number;      // seconds for reverb, ms for delay
    size: number;           // 0-100 for reverb, unused for delay
    damping: number;        // 0-100
    diffusion: number;      // 0-100
    highCut: number;        // Hz
    lowCut: number;         // Hz
    wetDry: number;         // 0-100
    earlyLateMix: number;   // 0-100 (reverb only)
    // Delay-specific
    delayTimeMs?: number;
    feedback?: number;      // 0-100
    noteSync?: string;
    stereoSpread?: number;  // 0-100
}

// ============================================================================
// Time Data (reverb/delay table modal config from API)
// ============================================================================

export interface SubdivisionEntry {
    key: string;
    label: string;
    gridKey: string;
    common: boolean;
}

export interface TimeData {
    timeSignatures: TimeSignatureOption[];
    reverbSubdivisions: SubdivisionEntry[];
    delaySubdivisions: SubdivisionEntry[];
    defaults: {
        bpm: number;
        timeSignature: string;
    };
}
