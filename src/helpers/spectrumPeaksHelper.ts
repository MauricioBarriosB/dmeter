export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
};

export const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatFrequency = (hz: number) => {
    if (hz >= 1000) {
        return `${(hz / 1000).toFixed(1)} kHz`;
    }
    return `${hz} Hz`;
};

export const getDbColor = (db: number) => {
    if (db >= -10) return "danger";
    if (db >= -30) return "warning";
    if (db >= -50) return "success";
    return "default";
};

export interface FrequencyPeak {
    frequency: number;
    amplitude: number;
}

export interface PaddedPeak {
    frequency: number;
    amplitude: number | null;
}

/**
 * Sorts spectrum peaks by frequency and pads to 20 bars for visualization.
 * Missing slots are filled with estimated frequencies and null amplitudes.
 */
export function getPaddedSpectrumPeaks(spectrumPeaks: FrequencyPeak[] | undefined): PaddedPeak[] {
    // Sort peaks by frequency for spectrum visualization (low to high)
    const sortedByFrequency = spectrumPeaks ? [...spectrumPeaks].sort((a, b) => a.frequency - b.frequency) : [];

    // Calculate frequency range for placeholder labels
    const minFreq = sortedByFrequency.length > 0 ? sortedByFrequency[0].frequency : 0;
    const maxFreq = sortedByFrequency.length > 0 ? sortedByFrequency[sortedByFrequency.length - 1].frequency : 20000;
    const freqStep = (maxFreq - minFreq) / 19 || 1000; // Step between bars

    // Pad to 20 bars (fill missing with estimated frequencies for gray placeholder bars)
    const paddedPeaks: PaddedPeak[] = sortedByFrequency.map((p) => ({
        frequency: p.frequency,
        amplitude: p.amplitude,
    }));

    // Fill remaining slots with estimated frequencies
    for (let i = sortedByFrequency.length; i < 20; i++) {
        const estimatedFreq = Math.round(maxFreq + freqStep * (i - sortedByFrequency.length + 1));
        paddedPeaks.push({ frequency: estimatedFreq, amplitude: null });
    }

    return paddedPeaks;
}
