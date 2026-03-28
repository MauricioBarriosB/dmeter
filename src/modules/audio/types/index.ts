// Chips colors
export type ChipColor = "primary" | "secondary" | "success" | "warning" | "danger" | "default";

// Frequency band analysis data
export interface FrequencyBandData {
    frequency: number;
    magnitude: number;
    phase: number;
}

// Complete frequency analysis structure
export interface FrequencyAnalysis {
    spectrumData: FrequencyBandData[];
    peakFrequencies: number[];
    dominantFrequency: number;
    fundamentalFrequency: number;
    spectralCentroid: number;
    spectralRolloff: number;
    spectralFlatness: number;
    spectralSpread: number;
    spectralSkewness: number;
    spectralKurtosis: number;
    octaveBands: { frequency: number; magnitude: number }[];
    thirdOctaveBands: { frequency: number; magnitude: number }[];
    harmonics: { frequency: number; magnitude: number; order: number }[];
    noiseFloor: number;
    dynamicRange: number;
    crestFactor: number;
    zeroCrossingRate: number;
    thdEstimate: number;
    subBassEnergy: number;
    bassEnergy: number;
    lowMidEnergy: number;
    midEnergy: number;
    upperMidEnergy: number;
    presenceEnergy: number;
    brillianceEnergy: number;
    stereoCorrelation: number;
    stereoWidth: number;
    phaseCoherence: number;
}

// Audio loudness metrics
export interface LoudnessMetrics {
    peakDb: number;
    truePeak: number;
    peakLeft: number;
    peakRight: number;
    rmsDb: number;
    rmsLeft: number;
    rmsRight: number;
    lufs: number;
    lufsShortTerm: number;
    lufsMomentary: number;
    loudnessRange: number;
    dynamicRange: number;
    psr: number;
    clippedSamples: number;
    clippingPercentage: number;
    dcOffset: number;
    headroom: number;
}

// Temporal analysis
export interface TemporalAnalysis {
    duration: number;
    sampleRate: number;
    bitDepth: number;
    channels: number;
    totalSamples: number;
    attackTime: number;
    decayTime: number;
    sustainLevel: number;
    releaseTime: number;
    estimatedBpm: number;
    bpmConfidence: number;
    timeSignature: string;
    transientCount: number;
    transientDensity: number;
    silencePercentage: number;
    leadingSilence: number;
    trailingSilence: number;
    sampleRateQuality: string;
    bitDepthQuality: string;
}

// Complete audio record structure
export interface AudioRecord {
    id: string;
    reportName: string;
    genre: string;
    genreLabel: string;
    media: string;
    mediaLabel: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    frequencyAnalysis: FrequencyAnalysis;
    loudnessMetrics: LoudnessMetrics;
    temporalAnalysis: TemporalAnalysis;
    createdAt: string;
    analyzedAt: string;
}

// Type definitions for API data
export type GenreOption = { value: string; label: string };
export type DistributionType = { value: string; label: string };
export type MediaOption = { value: string; label: string; lufsTarget: number | null; category?: string };
export type MasteringTarget = {
    lufsMin: number;
    lufsMax: number;
    dynamicRangeMin: number;
    dynamicRangeMax: number;
    description: string;
};
