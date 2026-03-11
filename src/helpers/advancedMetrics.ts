// Calculate Crest Factor (Peak to RMS ratio in dB)
export function calculateCrestFactor(peakDb: number, avgDb: number): number {
    return Math.abs(peakDb - avgDb);
}

// Calculate Dynamic Range
export function calculateDynamicRange(maxDb: number, minDb: number): number {
    return Math.abs(maxDb - minDb);
}

// Get loudness classification based on average dB
export function getLoudnessClassification(avgDb: number): {
    label: string;
    color: "danger" | "warning" | "success" | "primary" | "default";
    description: string;
} {
    if (avgDb >= -10)
        return {
            label: "Very Loud",
            color: "danger",
            description: "Risk of clipping/distortion",
        };
    if (avgDb >= -20)
        return {
            label: "Loud",
            color: "warning",
            description: "High energy content",
        };
    if (avgDb >= -40)
        return {
            label: "Moderate",
            color: "success",
            description: "Normal listening level",
        };
    if (avgDb >= -60)
        return {
            label: "Quiet",
            color: "primary",
            description: "Low ambient sound",
        };
    return { label: "Very Quiet", color: "default", description: "Near silence" };
}

// Calculate Spectral Centroid (center of mass of spectrum)
export function calculateSpectralCentroid(peaks: { frequency: number; amplitude: number }[]): number {
    if (!peaks || peaks.length === 0) return 0;

    // Convert dB to linear amplitude for weighting
    const linearPeaks = peaks.map((p) => ({
        frequency: p.frequency,
        amplitude: Math.pow(10, p.amplitude / 20),
    }));

    const weightedSum = linearPeaks.reduce((sum, p) => sum + p.frequency * p.amplitude, 0);
    const amplitudeSum = linearPeaks.reduce((sum, p) => sum + p.amplitude, 0);

    return amplitudeSum > 0 ? weightedSum / amplitudeSum : 0;
}

// Calculate Spectral Rolloff (frequency below which 85% of energy exists)
export function calculateSpectralRolloff(peaks: { frequency: number; amplitude: number }[]): number {
    if (!peaks || peaks.length === 0) return 0;

    // Sort by frequency
    const sorted = [...peaks].sort((a, b) => a.frequency - b.frequency);

    // Convert to linear and calculate total energy
    const linearPeaks = sorted.map((p) => ({
        frequency: p.frequency,
        energy: Math.pow(10, p.amplitude / 10), // Power (energy) is amplitude squared
    }));

    const totalEnergy = linearPeaks.reduce((sum, p) => sum + p.energy, 0);
    const threshold = totalEnergy * 0.85;

    let cumulativeEnergy = 0;
    for (const peak of linearPeaks) {
        cumulativeEnergy += peak.energy;
        if (cumulativeEnergy >= threshold) {
            return peak.frequency;
        }
    }

    return sorted.at(-1)?.frequency || 0;
}

// Calculate Spectral Flatness (0 = tonal, 1 = noise-like)
export function calculateSpectralFlatness(peaks: { frequency: number; amplitude: number }[]): number {
    if (!peaks || peaks.length === 0) return 0;

    // Convert dB to linear
    const linearAmplitudes = peaks.map((p) => Math.pow(10, p.amplitude / 20));

    // Geometric mean
    const logSum = linearAmplitudes.reduce((sum, a) => sum + Math.log(a + 1e-10), 0);
    const geometricMean = Math.exp(logSum / linearAmplitudes.length);

    // Arithmetic mean
    const arithmeticMean = linearAmplitudes.reduce((sum, a) => sum + a, 0) / linearAmplitudes.length;

    return arithmeticMean > 0 ? geometricMean / arithmeticMean : 0;
}

// Calculate frequency band energy distribution
export function calculateBandEnergy(peaks: { frequency: number; amplitude: number }[]): {
    low: number;
    mid: number;
    high: number;
} {
    if (!peaks || peaks.length === 0) return { low: 0, mid: 0, high: 0 };

    const bands = { low: 0, mid: 0, high: 0 };
    let totalEnergy = 0;

    for (const peak of peaks) {
        const energy = Math.pow(10, peak.amplitude / 10);
        totalEnergy += energy;

        if (peak.frequency < 250) {
            bands.low += energy;
        } else if (peak.frequency < 4000) {
            bands.mid += energy;
        } else {
            bands.high += energy;
        }
    }

    if (totalEnergy === 0) return { low: 0, mid: 0, high: 0 };

    return {
        low: (bands.low / totalEnergy) * 100,
        mid: (bands.mid / totalEnergy) * 100,
        high: (bands.high / totalEnergy) * 100,
    };
}

// Get brightness classification based on spectral centroid
export function getBrightnessClassification(centroid: number): {
    label: string;
    color: "danger" | "warning" | "success" | "primary" | "default";
} {
    if (centroid >= 8000) return { label: "Very Bright", color: "danger" };
    if (centroid >= 4000) return { label: "Bright", color: "warning" };
    if (centroid >= 1000) return { label: "Balanced", color: "success" };
    if (centroid >= 300) return { label: "Warm", color: "primary" };
    return { label: "Dark", color: "default" };
}
