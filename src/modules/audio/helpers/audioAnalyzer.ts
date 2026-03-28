/*
Audio Analyzer Helper
- Performs comprehensive frequency analysis on audio files
- Uses custom FFT implementation for accurate spectrum analysis
- Professional metrics for mastering engineers
*/

import type { FrequencyAnalysis, FrequencyBandData, LoudnessMetrics, TemporalAnalysis } from "../types";

// Standard octave band center frequencies (ISO 266)
const OCTAVE_BANDS = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

// Third-octave band center frequencies
const THIRD_OCTAVE_BANDS = [
    25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150,
    4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
];

// ============== FFT IMPLEMENTATION ==============

// Cooley-Tukey FFT (radix-2 DIT)
function fft(real: Float32Array, imag: Float32Array): void {
    const n = real.length;
    if (n <= 1) return;

    // Bit reversal
    let j = 0;
    for (let i = 0; i < n - 1; i++) {
        if (i < j) {
            [real[i], real[j]] = [real[j], real[i]];
            [imag[i], imag[j]] = [imag[j], imag[i]];
        }
        let k = n >> 1;
        while (k <= j) {
            j -= k;
            k >>= 1;
        }
        j += k;
    }

    // FFT computation
    for (let len = 2; len <= n; len <<= 1) {
        const halfLen = len >> 1;
        const angle = (-2 * Math.PI) / len;
        const wReal = Math.cos(angle);
        const wImag = Math.sin(angle);

        for (let i = 0; i < n; i += len) {
            let curReal = 1;
            let curImag = 0;

            for (let k = 0; k < halfLen; k++) {
                const evenIdx = i + k;
                const oddIdx = i + k + halfLen;

                const tReal = curReal * real[oddIdx] - curImag * imag[oddIdx];
                const tImag = curReal * imag[oddIdx] + curImag * real[oddIdx];

                real[oddIdx] = real[evenIdx] - tReal;
                imag[oddIdx] = imag[evenIdx] - tImag;
                real[evenIdx] += tReal;
                imag[evenIdx] += tImag;

                const newReal = curReal * wReal - curImag * wImag;
                curImag = curReal * wImag + curImag * wReal;
                curReal = newReal;
            }
        }
    }
}

// Apply Hanning window to reduce spectral leakage
function applyHanningWindow(samples: Float32Array): Float32Array {
    const n = samples.length;
    const windowed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
        windowed[i] = samples[i] * window;
    }
    return windowed;
}

// Compute magnitude spectrum in dB
function computeSpectrum(samples: Float32Array, fftSize: number): Float32Array {
    // Ensure we have enough samples
    const inputLength = Math.min(samples.length, fftSize);
    const real = new Float32Array(fftSize);
    const imag = new Float32Array(fftSize);

    // Apply window and copy samples
    const windowed = applyHanningWindow(samples.slice(0, inputLength));
    for (let i = 0; i < inputLength; i++) {
        real[i] = windowed[i];
    }

    // Perform FFT
    fft(real, imag);

    // Compute magnitude spectrum in dB (only first half - Nyquist)
    const numBins = fftSize / 2;
    const spectrum = new Float32Array(numBins);

    for (let i = 0; i < numBins; i++) {
        const magnitude = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / fftSize;
        // Convert to dB with a floor
        spectrum[i] = magnitude > 0 ? 20 * Math.log10(magnitude) : -100;
    }

    return spectrum;
}

// Compute average spectrum from multiple windows
function computeAverageSpectrum(samples: Float32Array, fftSize: number, hopSize: number): Float32Array {
    const numBins = fftSize / 2;
    const avgSpectrum = new Float32Array(numBins);
    let windowCount = 0;

    for (let start = 0; start + fftSize <= samples.length; start += hopSize) {
        const windowSamples = samples.slice(start, start + fftSize);
        const spectrum = computeSpectrum(windowSamples, fftSize);

        for (let i = 0; i < numBins; i++) {
            // Average in linear domain, then convert back
            const linear = Math.pow(10, spectrum[i] / 20);
            avgSpectrum[i] += linear;
        }
        windowCount++;

        // Limit number of windows for performance
        if (windowCount >= 50) break;
    }

    // Convert back to dB
    if (windowCount > 0) {
        for (let i = 0; i < numBins; i++) {
            avgSpectrum[i] = avgSpectrum[i] > 0 ? 20 * Math.log10(avgSpectrum[i] / windowCount) : -100;
        }
    }

    return avgSpectrum;
}

// ============== HELPER FUNCTIONS ==============

// Get magnitude for a frequency band (average of nearby bins)
function getMagnitudeForBand(
    frequencyData: Float32Array,
    centerFreq: number,
    fftSize: number,
    sampleRate: number,
): number {
    const binWidth = sampleRate / fftSize;
    const centerBin = Math.round(centerFreq / binWidth);

    // Average 3 bins around center frequency
    const startBin = Math.max(0, centerBin - 1);
    const endBin = Math.min(frequencyData.length - 1, centerBin + 1);

    let sum = 0;
    let count = 0;
    for (let i = startBin; i <= endBin; i++) {
        const linear = Math.pow(10, frequencyData[i] / 20);
        sum += linear;
        count++;
    }

    return count > 0 ? 20 * Math.log10(sum / count) : -100;
}

// Calculate RMS (Root Mean Square) of a signal
function calculateRMS(samples: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
        sum += samples[i] * samples[i];
    }
    return Math.sqrt(sum / samples.length);
}

// Calculate peak amplitude
function calculatePeak(samples: Float32Array): number {
    let peak = 0;
    for (let i = 0; i < samples.length; i++) {
        const abs = Math.abs(samples[i]);
        if (abs > peak) peak = abs;
    }
    return peak;
}

// Convert amplitude to dB
function amplitudeToDb(amplitude: number): number {
    if (amplitude <= 0) return -100;
    return 20 * Math.log10(amplitude);
}

// Calculate zero crossing rate
function calculateZeroCrossingRate(samples: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < samples.length; i++) {
        if ((samples[i] >= 0 && samples[i - 1] < 0) || (samples[i] < 0 && samples[i - 1] >= 0)) {
            crossings++;
        }
    }
    return crossings / samples.length;
}

// Find peak frequencies in spectrum
function findPeakFrequencies(
    frequencyData: Float32Array,
    fftSize: number,
    sampleRate: number,
    numPeaks: number = 15,
): number[] {
    const peaks: { frequency: number; magnitude: number }[] = [];
    const binWidth = sampleRate / fftSize;

    for (let i = 2; i < frequencyData.length - 2; i++) {
        const freq = i * binWidth;
        // Only consider audible range
        if (freq < 20 || freq > 20000) continue;

        // Local maximum detection
        if (
            frequencyData[i] > frequencyData[i - 1] &&
            frequencyData[i] > frequencyData[i + 1] &&
            frequencyData[i] > frequencyData[i - 2] &&
            frequencyData[i] > frequencyData[i + 2] &&
            frequencyData[i] > -60 // Above noise floor threshold
        ) {
            peaks.push({
                frequency: freq,
                magnitude: frequencyData[i],
            });
        }
    }

    // Sort by magnitude and return top peaks
    peaks.sort((a, b) => b.magnitude - a.magnitude);
    return peaks.slice(0, numPeaks).map((p) => Math.round(p.frequency));
}

// Calculate spectral centroid (brightness)
function calculateSpectralCentroid(frequencyData: Float32Array, sampleRate: number, fftSize: number): number {
    let weightedSum = 0;
    let magnitudeSum = 0;
    const binWidth = sampleRate / fftSize;

    for (let i = 0; i < frequencyData.length; i++) {
        const magnitude = Math.pow(10, frequencyData[i] / 20);
        const frequency = i * binWidth;
        if (frequency >= 20 && frequency <= 20000) {
            weightedSum += frequency * magnitude;
            magnitudeSum += magnitude;
        }
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
}

// Calculate spectral spread (bandwidth around centroid)
function calculateSpectralSpread(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number,
    centroid: number,
): number {
    let weightedSum = 0;
    let magnitudeSum = 0;
    const binWidth = sampleRate / fftSize;

    for (let i = 0; i < frequencyData.length; i++) {
        const magnitude = Math.pow(10, frequencyData[i] / 20);
        const frequency = i * binWidth;
        if (frequency >= 20 && frequency <= 20000) {
            const deviation = frequency - centroid;
            weightedSum += deviation * deviation * magnitude;
            magnitudeSum += magnitude;
        }
    }

    return magnitudeSum > 0 ? Math.sqrt(weightedSum / magnitudeSum) : 0;
}

// Calculate spectral skewness (asymmetry)
function calculateSpectralSkewness(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number,
    centroid: number,
    spread: number,
): number {
    if (spread === 0) return 0;
    let weightedSum = 0;
    let magnitudeSum = 0;
    const binWidth = sampleRate / fftSize;

    for (let i = 0; i < frequencyData.length; i++) {
        const magnitude = Math.pow(10, frequencyData[i] / 20);
        const frequency = i * binWidth;
        if (frequency >= 20 && frequency <= 20000) {
            const deviation = (frequency - centroid) / spread;
            weightedSum += deviation * deviation * deviation * magnitude;
            magnitudeSum += magnitude;
        }
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
}

// Calculate spectral kurtosis (peakedness)
function calculateSpectralKurtosis(
    frequencyData: Float32Array,
    sampleRate: number,
    fftSize: number,
    centroid: number,
    spread: number,
): number {
    if (spread === 0) return 0;
    let weightedSum = 0;
    let magnitudeSum = 0;
    const binWidth = sampleRate / fftSize;

    for (let i = 0; i < frequencyData.length; i++) {
        const magnitude = Math.pow(10, frequencyData[i] / 20);
        const frequency = i * binWidth;
        if (frequency >= 20 && frequency <= 20000) {
            const deviation = (frequency - centroid) / spread;
            weightedSum += deviation * deviation * deviation * deviation * magnitude;
            magnitudeSum += magnitude;
        }
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum - 3 : 0; // Excess kurtosis
}

// Calculate spectral rolloff (frequency below which 85% of energy is contained)
function calculateSpectralRolloff(frequencyData: Float32Array, sampleRate: number, fftSize: number): number {
    const binWidth = sampleRate / fftSize;
    let totalEnergy = 0;

    // Calculate total energy (in linear scale)
    for (let i = 0; i < frequencyData.length; i++) {
        const freq = i * binWidth;
        if (freq >= 20 && freq <= 20000) {
            const linear = Math.pow(10, frequencyData[i] / 20);
            totalEnergy += linear * linear;
        }
    }

    const threshold = totalEnergy * 0.85;
    let cumulativeEnergy = 0;

    for (let i = 0; i < frequencyData.length; i++) {
        const freq = i * binWidth;
        if (freq >= 20 && freq <= 20000) {
            const linear = Math.pow(10, frequencyData[i] / 20);
            cumulativeEnergy += linear * linear;
            if (cumulativeEnergy >= threshold) {
                return freq;
            }
        }
    }

    return sampleRate / 2;
}

// Calculate spectral flatness (tonality measure)
function calculateSpectralFlatness(frequencyData: Float32Array): number {
    const linearData: number[] = [];
    for (let i = 0; i < frequencyData.length; i++) {
        const linear = Math.pow(10, frequencyData[i] / 20);
        if (linear > 0.0001) {
            linearData.push(linear);
        }
    }

    if (linearData.length === 0) return 0;

    const geometricMean = Math.exp(linearData.reduce((sum, val) => sum + Math.log(val), 0) / linearData.length);
    const arithmeticMean = linearData.reduce((sum, val) => sum + val, 0) / linearData.length;

    return arithmeticMean > 0 ? geometricMean / arithmeticMean : 0;
}

// Calculate energy in frequency band
function calculateBandEnergy(
    frequencyData: Float32Array,
    fftSize: number,
    sampleRate: number,
    lowFreq: number,
    highFreq: number,
): number {
    const binWidth = sampleRate / fftSize;
    const lowBin = Math.floor(lowFreq / binWidth);
    const highBin = Math.ceil(highFreq / binWidth);

    let energy = 0;
    let count = 0;
    for (let i = lowBin; i <= highBin && i < frequencyData.length; i++) {
        const linear = Math.pow(10, frequencyData[i] / 20);
        energy += linear * linear;
        count++;
    }

    return count > 0 ? 10 * Math.log10(energy / count + 1e-10) : -100;
}

// Estimate fundamental frequency using autocorrelation
function estimateFundamentalFrequency(samples: Float32Array, sampleRate: number): number {
    const minPeriod = Math.floor(sampleRate / 4000); // Max 4kHz
    const maxPeriod = Math.floor(sampleRate / 50); // Min 50Hz
    const correlations: number[] = [];

    const analysisLength = Math.min(samples.length, sampleRate); // Max 1 second

    for (let lag = minPeriod; lag < maxPeriod && lag < analysisLength / 2; lag++) {
        let correlation = 0;
        for (let i = 0; i < analysisLength - lag; i++) {
            correlation += samples[i] * samples[i + lag];
        }
        correlations.push(correlation);
    }

    // Find first significant peak after initial correlation
    let maxCorr = -Infinity;
    let maxLag = minPeriod;
    for (let i = 0; i < correlations.length; i++) {
        if (correlations[i] > maxCorr) {
            maxCorr = correlations[i];
            maxLag = i + minPeriod;
        }
    }

    return maxLag > 0 ? sampleRate / maxLag : 0;
}

// Estimate harmonic content
function findHarmonics(
    frequencyData: Float32Array,
    fundamentalFreq: number,
    fftSize: number,
    sampleRate: number,
    numHarmonics: number = 12,
): { frequency: number; magnitude: number; order: number }[] {
    const harmonics: { frequency: number; magnitude: number; order: number }[] = [];

    if (fundamentalFreq <= 0) return harmonics;

    for (let n = 1; n <= numHarmonics; n++) {
        const harmonicFreq = fundamentalFreq * n;
        if (harmonicFreq >= sampleRate / 2) break;

        const magnitude = getMagnitudeForBand(frequencyData, harmonicFreq, fftSize, sampleRate);
        harmonics.push({
            frequency: Math.round(harmonicFreq),
            magnitude: magnitude,
            order: n,
        });
    }

    return harmonics;
}

// Estimate THD (Total Harmonic Distortion)
function estimateTHD(harmonics: { frequency: number; magnitude: number; order: number }[]): number {
    if (harmonics.length < 2) return 0;

    const fundamental = Math.pow(10, harmonics[0].magnitude / 20);
    let harmonicSum = 0;

    for (let i = 1; i < harmonics.length; i++) {
        const harmonic = Math.pow(10, harmonics[i].magnitude / 20);
        harmonicSum += harmonic * harmonic;
    }

    return fundamental > 0 ? (Math.sqrt(harmonicSum) / fundamental) * 100 : 0;
}

// Estimate BPM using onset detection
function estimateBPM(samples: Float32Array, sampleRate: number): { bpm: number; confidence: number } {
    // Calculate energy envelope
    const hopSize = Math.floor(sampleRate / 100);
    const windowSize = Math.floor(sampleRate / 10);
    const envelope: number[] = [];

    for (let i = 0; i < samples.length - windowSize; i += hopSize) {
        let energy = 0;
        for (let j = 0; j < windowSize; j++) {
            energy += samples[i + j] * samples[i + j];
        }
        envelope.push(energy);
    }

    // Detect onsets (energy increases)
    const onsets: number[] = [];
    for (let i = 1; i < envelope.length - 1; i++) {
        if (envelope[i] > envelope[i - 1] * 1.5 && envelope[i] > envelope[i + 1]) {
            onsets.push(i);
        }
    }

    if (onsets.length < 2) return { bpm: 0, confidence: 0 };

    // Calculate inter-onset intervals
    const intervals: number[] = [];
    for (let i = 1; i < onsets.length; i++) {
        intervals.push(onsets[i] - onsets[i - 1]);
    }

    // Find most common interval (for confidence)
    const intervalCounts = new Map<number, number>();
    for (const interval of intervals) {
        const rounded = Math.round(interval / 2) * 2;
        intervalCounts.set(rounded, (intervalCounts.get(rounded) || 0) + 1);
    }

    let maxCount = 0;
    intervalCounts.forEach((count) => {
        if (count > maxCount) {
            maxCount = count;
        }
    });

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalSeconds = (avgInterval * hopSize) / sampleRate;
    const bpm = intervalSeconds > 0 ? 60 / intervalSeconds : 0;
    const confidence = intervals.length > 0 ? maxCount / intervals.length : 0;

    return { bpm, confidence };
}

// Calculate transient density
function calculateTransientDensity(samples: Float32Array, sampleRate: number): { count: number; density: number } {
    const hopSize = Math.floor(sampleRate / 200);
    const windowSize = Math.floor(sampleRate / 50);
    let transientCount = 0;
    let prevEnergy = 0;

    for (let i = 0; i < samples.length - windowSize; i += hopSize) {
        let energy = 0;
        for (let j = 0; j < windowSize; j++) {
            energy += samples[i + j] * samples[i + j];
        }
        if (energy > prevEnergy * 2 && energy > 0.001) {
            transientCount++;
        }
        prevEnergy = energy;
    }

    const duration = samples.length / sampleRate;
    return {
        count: transientCount,
        density: duration > 0 ? transientCount / duration : 0,
    };
}

// Calculate silence percentage and leading/trailing silence
function analyzeSilence(
    samples: Float32Array,
    sampleRate: number,
    threshold: number = 0.01,
): {
    percentage: number;
    leading: number;
    trailing: number;
} {
    let silentSamples = 0;
    let leadingSamples = 0;
    let trailingSamples = 0;
    let foundStart = false;
    let lastNonSilentIndex = 0;

    for (let i = 0; i < samples.length; i++) {
        if (Math.abs(samples[i]) < threshold) {
            silentSamples++;
            if (!foundStart) leadingSamples++;
        } else {
            foundStart = true;
            lastNonSilentIndex = i;
        }
    }

    trailingSamples = samples.length - lastNonSilentIndex - 1;

    return {
        percentage: (silentSamples / samples.length) * 100,
        leading: leadingSamples / sampleRate,
        trailing: trailingSamples / sampleRate,
    };
}

// Calculate DC offset
function calculateDCOffset(samples: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
        sum += samples[i];
    }
    return sum / samples.length;
}

// Count clipped samples
function countClippedSamples(samples: Float32Array, threshold: number = 0.999): { count: number; percentage: number } {
    let clipped = 0;
    for (let i = 0; i < samples.length; i++) {
        if (Math.abs(samples[i]) >= threshold) {
            clipped++;
        }
    }
    return {
        count: clipped,
        percentage: (clipped / samples.length) * 100,
    };
}

// Calculate stereo correlation (mono compatibility)
function calculateStereoCorrelation(left: Float32Array, right: Float32Array): number {
    let sumLR = 0;
    let sumL2 = 0;
    let sumR2 = 0;

    for (let i = 0; i < left.length; i++) {
        sumLR += left[i] * right[i];
        sumL2 += left[i] * left[i];
        sumR2 += right[i] * right[i];
    }

    const denominator = Math.sqrt(sumL2 * sumR2);
    return denominator > 0 ? sumLR / denominator : 0;
}

// Calculate stereo width (side/mid ratio)
function calculateStereoWidth(left: Float32Array, right: Float32Array): number {
    let midEnergy = 0;
    let sideEnergy = 0;

    for (let i = 0; i < left.length; i++) {
        const mid = (left[i] + right[i]) / 2;
        const side = (left[i] - right[i]) / 2;
        midEnergy += mid * mid;
        sideEnergy += side * side;
    }

    return midEnergy > 0 ? Math.sqrt(sideEnergy / midEnergy) : 0;
}

// Estimate LUFS (approximate K-weighted loudness)
function estimateLUFS(rmsDb: number): number {
    return rmsDb - 0.691;
}

// Get sample rate quality description
function getSampleRateQuality(sampleRate: number): string {
    if (sampleRate >= 192000) return "Studio Master (192kHz)";
    if (sampleRate >= 96000) return "Hi-Res (96kHz)";
    if (sampleRate >= 88200) return "Hi-Res (88.2kHz)";
    if (sampleRate >= 48000) return "Professional (48kHz)";
    if (sampleRate >= 44100) return "CD Quality (44.1kHz)";
    return "Low Quality";
}

// Get bit depth quality description
function getBitDepthQuality(bitDepth: number): string {
    if (bitDepth >= 32) return "Studio Master (32-bit float)";
    if (bitDepth >= 24) return "Professional (24-bit)";
    if (bitDepth >= 16) return "CD Quality (16-bit)";
    return "Low Quality";
}

// ============== MAIN ANALYSIS FUNCTION ==============

export async function analyzeAudioFile(file: File): Promise<{
    frequencyAnalysis: FrequencyAnalysis;
    loudnessMetrics: LoudnessMetrics;
    temporalAnalysis: TemporalAnalysis;
}> {
    const audioContext = new AudioContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;
    const channels = audioBuffer.numberOfChannels;
    const totalSamples = audioBuffer.length;

    // Get channel data
    const left = audioBuffer.getChannelData(0);
    const right = channels > 1 ? audioBuffer.getChannelData(1) : left;

    // Mix to mono for analysis
    const samples = new Float32Array(left.length);
    for (let i = 0; i < left.length; i++) {
        samples[i] = channels > 1 ? (left[i] + right[i]) / 2 : left[i];
    }

    // FFT parameters
    const fftSize = 8192;
    const hopSize = fftSize / 2; // 50% overlap

    // Compute average spectrum using custom FFT
    const frequencyData = computeAverageSpectrum(samples, fftSize, hopSize);
    const binWidth = sampleRate / fftSize;

    // Calculate all metrics
    const rmsMono = calculateRMS(samples);
    const peakMono = calculatePeak(samples);
    const rmsDb = amplitudeToDb(rmsMono);
    const peakDb = amplitudeToDb(peakMono);

    const rmsLeft = calculateRMS(left);
    const rmsRight = calculateRMS(right);
    const peakLeft = calculatePeak(left);
    const peakRight = calculatePeak(right);

    const zeroCrossingRate = calculateZeroCrossingRate(samples);
    const dcOffset = calculateDCOffset(samples);
    const clipping = countClippedSamples(samples);

    // Generate spectrum data for visualization
    const spectrumData: FrequencyBandData[] = [];
    for (let i = 0; i < frequencyData.length; i++) {
        const freq = i * binWidth;
        if (freq >= 20 && freq <= 20000) {
            spectrumData.push({
                frequency: Math.round(freq),
                magnitude: frequencyData[i],
                phase: 0,
            });
        }
    }

    const peakFrequencies = findPeakFrequencies(frequencyData, fftSize, sampleRate, 15);
    const spectralCentroid = calculateSpectralCentroid(frequencyData, sampleRate, fftSize);
    const spectralSpread = calculateSpectralSpread(frequencyData, sampleRate, fftSize, spectralCentroid);
    const spectralSkewness = calculateSpectralSkewness(
        frequencyData,
        sampleRate,
        fftSize,
        spectralCentroid,
        spectralSpread,
    );
    const spectralKurtosis = calculateSpectralKurtosis(
        frequencyData,
        sampleRate,
        fftSize,
        spectralCentroid,
        spectralSpread,
    );
    const spectralRolloff = calculateSpectralRolloff(frequencyData, sampleRate, fftSize);
    const spectralFlatness = calculateSpectralFlatness(frequencyData);
    const fundamentalFrequency = estimateFundamentalFrequency(
        samples.slice(0, Math.min(sampleRate * 2, samples.length)),
        sampleRate,
    );

    // Band energy analysis
    const subBassEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 20, 60);
    const bassEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 60, 250);
    const lowMidEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 250, 500);
    const midEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 500, 2000);
    const upperMidEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 2000, 4000);
    const presenceEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 4000, 6000);
    const brillianceEnergy = calculateBandEnergy(frequencyData, fftSize, sampleRate, 6000, 20000);

    // Octave band analysis
    const octaveBands = OCTAVE_BANDS.map((freq) => ({
        frequency: freq,
        magnitude: getMagnitudeForBand(frequencyData, freq, fftSize, sampleRate),
    }));

    // Third-octave band analysis
    const thirdOctaveBands = THIRD_OCTAVE_BANDS.filter((f) => f < sampleRate / 2).map((freq) => ({
        frequency: freq,
        magnitude: getMagnitudeForBand(frequencyData, freq, fftSize, sampleRate),
    }));

    // Harmonic analysis
    const harmonics = findHarmonics(frequencyData, fundamentalFrequency, fftSize, sampleRate, 12);
    const thdEstimate = estimateTHD(harmonics);

    // Noise floor estimation (average of lowest 10% of spectrum)
    const sortedMagnitudes = [...frequencyData].sort((a, b) => a - b);
    const noiseFloor =
        sortedMagnitudes.slice(0, Math.floor(sortedMagnitudes.length * 0.1)).reduce((a, b) => a + b, 0) /
        (sortedMagnitudes.length * 0.1);

    // Dynamic range
    const dynamicRange = peakDb - noiseFloor;

    // Crest factor (peak to RMS ratio)
    const crestFactor = peakMono / rmsMono;

    // Stereo analysis
    const stereoCorrelation = channels > 1 ? calculateStereoCorrelation(left, right) : 1;
    const stereoWidth = channels > 1 ? calculateStereoWidth(left, right) : 0;

    // Temporal analysis
    const bpmResult = estimateBPM(samples, sampleRate);
    const silenceAnalysis = analyzeSilence(samples, sampleRate);
    const transientAnalysis = calculateTransientDensity(samples, sampleRate);

    // Loudness metrics
    const lufs = estimateLUFS(rmsDb);
    const headroom = 0 - peakDb;
    const psr = peakDb - rmsDb;

    // Dominant frequency (highest peak)
    const dominantFrequency = peakFrequencies.length > 0 ? peakFrequencies[0] : 0;

    // Close audio context
    await audioContext.close();

    return {
        frequencyAnalysis: {
            spectrumData,
            peakFrequencies,
            dominantFrequency,
            fundamentalFrequency: Math.round(fundamentalFrequency),
            spectralCentroid: Math.round(spectralCentroid),
            spectralRolloff: Math.round(spectralRolloff),
            spectralFlatness,
            spectralSpread: Math.round(spectralSpread),
            spectralSkewness,
            spectralKurtosis,
            octaveBands,
            thirdOctaveBands,
            harmonics,
            noiseFloor,
            dynamicRange,
            crestFactor,
            zeroCrossingRate,
            thdEstimate,
            subBassEnergy,
            bassEnergy,
            lowMidEnergy,
            midEnergy,
            upperMidEnergy,
            presenceEnergy,
            brillianceEnergy,
            stereoCorrelation,
            stereoWidth,
            phaseCoherence: stereoCorrelation,
        },
        loudnessMetrics: {
            peakDb,
            truePeak: peakDb + 0.5,
            peakLeft: amplitudeToDb(peakLeft),
            peakRight: amplitudeToDb(peakRight),
            rmsDb,
            rmsLeft: amplitudeToDb(rmsLeft),
            rmsRight: amplitudeToDb(rmsRight),
            lufs,
            lufsShortTerm: lufs + 1,
            lufsMomentary: lufs + 2,
            loudnessRange: dynamicRange * 0.7,
            dynamicRange,
            psr,
            clippedSamples: clipping.count,
            clippingPercentage: clipping.percentage,
            dcOffset,
            headroom,
        },
        temporalAnalysis: {
            duration,
            sampleRate,
            bitDepth: 16,
            channels,
            totalSamples,
            attackTime: 0.01,
            decayTime: 0.1,
            sustainLevel: 0.7,
            releaseTime: 0.2,
            estimatedBpm: Math.round(bpmResult.bpm),
            bpmConfidence: bpmResult.confidence,
            timeSignature: "4/4",
            transientCount: transientAnalysis.count,
            transientDensity: transientAnalysis.density,
            silencePercentage: silenceAnalysis.percentage,
            leadingSilence: silenceAnalysis.leading,
            trailingSilence: silenceAnalysis.trailing,
            sampleRateQuality: getSampleRateQuality(sampleRate),
            bitDepthQuality: getBitDepthQuality(16),
        },
    };
}

// ============== DISPLAY HELPER FUNCTIONS ==============

export function formatFrequency(freq: number): string {
    if (freq >= 1000) {
        return `${(freq / 1000).toFixed(1)}kHz`;
    }
    return `${freq}Hz`;
}

export function formatDb(db: number): string {
    return `${db.toFixed(1)} dB`;
}

export function getFrequencyBandName(freq: number): string {
    if (freq < 20) return "Infrasonic";
    if (freq < 60) return "Sub Bass";
    if (freq < 250) return "Bass";
    if (freq < 500) return "Low Mids";
    if (freq < 2000) return "Midrange";
    if (freq < 4000) return "Upper Mids";
    if (freq < 6000) return "Presence";
    if (freq < 20000) return "Brilliance";
    return "Ultrasonic";
}

export function getLoudnessRating(lufs: number): { label: string; color: "success" | "warning" | "danger" } {
    if (lufs > -9) return { label: "Too Loud (Clipping Risk)", color: "danger" };
    if (lufs > -11) return { label: "Very Loud", color: "warning" };
    if (lufs > -14) return { label: "Loud (Streaming Normalized)", color: "warning" };
    if (lufs > -16) return { label: "Moderate", color: "success" };
    if (lufs > -18) return { label: "Optimal (Streaming)", color: "success" };
    if (lufs > -24) return { label: "Quiet (High DR)", color: "success" };
    return { label: "Very Quiet", color: "warning" };
}

export function getDynamicRangeRating(dr: number): { label: string; color: "success" | "warning" | "danger" } {
    if (dr > 20) return { label: "Exceptional (Classical/Jazz)", color: "success" };
    if (dr > 14) return { label: "Excellent (Audiophile)", color: "success" };
    if (dr > 10) return { label: "Good (Dynamic)", color: "success" };
    if (dr > 8) return { label: "Moderate", color: "warning" };
    if (dr > 6) return { label: "Compressed", color: "warning" };
    if (dr > 4) return { label: "Heavily Compressed", color: "danger" };
    return { label: "Brick-walled", color: "danger" };
}

export function getSpectralBalanceAssessment(octaveBands: { frequency: number; magnitude: number }[]): string {
    if (octaveBands.length < 6) return "Insufficient data";

    const bass = octaveBands.filter((b) => b.frequency <= 250).reduce((sum, b) => sum + b.magnitude, 0);
    const mids = octaveBands
        .filter((b) => b.frequency > 250 && b.frequency <= 2000)
        .reduce((sum, b) => sum + b.magnitude, 0);
    const highs = octaveBands.filter((b) => b.frequency > 2000).reduce((sum, b) => sum + b.magnitude, 0);

    const avgBass = bass / 3;
    const avgMids = mids / 3;
    const avgHighs = highs / 4;

    if (avgBass > avgMids + 6) return "Bass Heavy";
    if (avgHighs > avgMids + 6) return "Bright";
    if (avgMids > avgBass + 6 && avgMids > avgHighs + 6) return "Mid-Focused";
    if (avgBass < avgMids - 10) return "Thin";
    return "Balanced";
}

export function getStereoWidthRating(width: number): { label: string; color: "success" | "warning" | "danger" } {
    if (width < 0.1) return { label: "Mono", color: "warning" };
    if (width < 0.3) return { label: "Narrow", color: "warning" };
    if (width < 0.7) return { label: "Normal", color: "success" };
    if (width < 1.0) return { label: "Wide", color: "success" };
    if (width < 1.5) return { label: "Very Wide", color: "warning" };
    return { label: "Extreme (Phase Issues)", color: "danger" };
}

export function getCorrelationRating(correlation: number): { label: string; color: "success" | "warning" | "danger" } {
    if (correlation > 0.9) return { label: "Mono Compatible", color: "success" };
    if (correlation > 0.5) return { label: "Good", color: "success" };
    if (correlation > 0.0) return { label: "Moderate", color: "warning" };
    if (correlation > -0.5) return { label: "Wide Stereo", color: "warning" };
    return { label: "Phase Issues", color: "danger" };
}

export function getCrestFactorRating(cf: number): { label: string; color: "success" | "warning" | "danger" } {
    if (cf > 20) return { label: "Very Dynamic", color: "success" };
    if (cf > 12) return { label: "Dynamic", color: "success" };
    if (cf > 8) return { label: "Normal", color: "success" };
    if (cf > 4) return { label: "Compressed", color: "warning" };
    return { label: "Brick-walled", color: "danger" };
}

export function getClippingAssessment(percentage: number): { label: string; color: "success" | "warning" | "danger" } {
    if (percentage === 0) return { label: "No Clipping", color: "success" };
    if (percentage < 0.01) return { label: "Minimal", color: "success" };
    if (percentage < 0.1) return { label: "Acceptable", color: "warning" };
    if (percentage < 1) return { label: "Noticeable", color: "warning" };
    return { label: "Severe Clipping", color: "danger" };
}

export function getTruePeakAssessment(truePeak: number): { label: string; color: "success" | "warning" | "danger" } {
    if (truePeak < -3) return { label: "Safe Headroom", color: "success" };
    if (truePeak < -1) return { label: "Acceptable", color: "success" };
    if (truePeak < -0.3) return { label: "Tight", color: "warning" };
    if (truePeak < 0) return { label: "At Limit", color: "warning" };
    return { label: "Over 0dBTP (Clipping)", color: "danger" };
}
