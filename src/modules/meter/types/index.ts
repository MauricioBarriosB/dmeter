// Frequency peak data from spectrum analysis
export interface FrequencyPeak {
    frequency: number; // Hz
    amplitude: number; // dB
}

// Analysis record from meter measurements
export interface AnalysisRecord {
    id: string;
    name: string; // User-defined analysis label
    date: string;
    duration: number;
    peakDb: number;
    avgDb: number;
    minDb: number;
    maxDb: number;
    spectrumPeaks?: FrequencyPeak[]; // Top frequencies with highest amplitudes
}
