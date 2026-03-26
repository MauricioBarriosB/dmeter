/*
Audio Analysis Storage
- loadAudioHistory() - Loads audio analysis records from localStorage
- saveAudioHistory(history) - Saves audio analysis records to localStorage
- clearAudioHistory() - Removes all audio history from localStorage
*/

import { fetchFromApi } from "./apiClient";
import { validateStorageAccess, isStorageValid } from "./analysisStorage";

// Re-export storage validation functions
export { validateStorageAccess, isStorageValid };

const storageKey: string = import.meta.env.VITE_STORAGE_KEY;

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

interface AudioDataResponse {
    genreOptions: GenreOption[];
    distributionTypes: DistributionType[];
    mediaByDistribution: Record<string, MediaOption[]>;
    genreCategories: Record<string, string>;
    masteringTargets: Record<string, MasteringTarget>;
}

// Module-level cache for audio data
let audioDataCache: AudioDataResponse | null = null;
let loadingPromise: Promise<AudioDataResponse> | null = null;

/**
 * Load audio data from API (with caching)
 */
export async function loadAudioData(): Promise<AudioDataResponse> {
    if (audioDataCache) {
        return audioDataCache;
    }

    if (loadingPromise) {
        return loadingPromise;
    }

    loadingPromise = fetchFromApi<AudioDataResponse>("audioData")
        .then((data) => {
            audioDataCache = data;
            return data;
        })
        .finally(() => {
            loadingPromise = null;
        });

    return loadingPromise;
}

/**
 * Get cached audio data (returns null if not loaded)
 */
export function getAudioDataSync(): AudioDataResponse | null {
    return audioDataCache;
}

/**
 * Get genre options (async)
 */
export async function getGenreOptions(): Promise<GenreOption[]> {
    const data = await loadAudioData();
    return data.genreOptions;
}

/**
 * Get distribution types (async)
 */
export async function getDistributionTypes(): Promise<DistributionType[]> {
    const data = await loadAudioData();
    return data.distributionTypes;
}

/**
 * Get media by distribution (async)
 */
export async function getMediaByDistribution(): Promise<Record<string, MediaOption[]>> {
    const data = await loadAudioData();
    return data.mediaByDistribution;
}

/**
 * Get flat media options list (async)
 */
export async function getMediaOptions(): Promise<MediaOption[]> {
    const data = await loadAudioData();
    return Object.entries(data.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category }))
    );
}

// Storage functions
const audioStorageKey = `${storageKey}_audio`;

export async function loadAudioHistory(): Promise<AudioRecord[]> {
    if (!(await validateStorageAccess())) return [];

    const stored = localStorage.getItem(audioStorageKey);
    if (stored) {
        try {
            return JSON.parse(stored) as AudioRecord[];
        } catch {
            console.error("Failed to parse stored audio history");
            return [];
        }
    }
    return [];
}

export async function saveAudioHistory(history: AudioRecord[]): Promise<void> {
    if (!(await validateStorageAccess())) return;
    localStorage.setItem(audioStorageKey, JSON.stringify(history));
}

export async function clearAudioHistory(): Promise<void> {
    if (!(await validateStorageAccess())) return;
    localStorage.removeItem(audioStorageKey);
}

// Helper functions (async versions)
export async function getGenreLabel(value: string): Promise<string> {
    const data = await loadAudioData();
    return data.genreOptions.find((g) => g.value === value)?.label || value;
}

export async function getMediaLabel(value: string): Promise<string> {
    const mediaOptions = await getMediaOptions();
    return mediaOptions.find((m) => m.value === value)?.label || value;
}

export async function getMediaLufsTarget(value: string): Promise<number | null> {
    const mediaOptions = await getMediaOptions();
    const media = mediaOptions.find((m) => m.value === value);
    return media?.lufsTarget ?? null;
}

export async function getMediaCategory(value: string): Promise<string> {
    const mediaOptions = await getMediaOptions();
    const media = mediaOptions.find((m) => m.value === value);
    return media?.category ?? "other";
}

export async function getGenreCategory(value: string): Promise<string> {
    const data = await loadAudioData();
    return data.genreCategories[value] || "Other";
}

export async function getGenreMasteringTargets(value: string): Promise<MasteringTarget> {
    const data = await loadAudioData();
    const category = data.genreCategories[value] || "Other";
    return data.masteringTargets[category] || {
        lufsMin: -14,
        lufsMax: -10,
        dynamicRangeMin: 8,
        dynamicRangeMax: 14,
        description: "Balanced mastering",
    };
}

// Sync helper functions (use cached data)
export function getGenreLabelSync(value: string): string {
    if (!audioDataCache) return value;
    return audioDataCache.genreOptions.find((g) => g.value === value)?.label || value;
}

export function getMediaLabelSync(value: string): string {
    if (!audioDataCache) return value;
    const mediaOptions = Object.entries(audioDataCache.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category }))
    );
    return mediaOptions.find((m) => m.value === value)?.label || value;
}

export function getMediaLufsTargetSync(value: string): number | null {
    if (!audioDataCache) return null;
    const mediaOptions = Object.entries(audioDataCache.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category }))
    );
    const media = mediaOptions.find((m) => m.value === value);
    return media?.lufsTarget ?? null;
}

export function getMediaCategorySync(value: string): string {
    if (!audioDataCache) return "other";
    const mediaOptions = Object.entries(audioDataCache.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category }))
    );
    const media = mediaOptions.find((m) => m.value === value);
    return media?.category ?? "other";
}

export function getGenreCategorySync(value: string): string {
    if (!audioDataCache) return "Other";
    return audioDataCache.genreCategories[value] || "Other";
}

export function getGenreMasteringTargetsSync(value: string): MasteringTarget {
    const defaultTarget = {
        lufsMin: -14,
        lufsMax: -10,
        dynamicRangeMin: 8,
        dynamicRangeMax: 14,
        description: "Balanced mastering",
    };
    if (!audioDataCache) return defaultTarget;
    const category = audioDataCache.genreCategories[value] || "Other";
    return audioDataCache.masteringTargets[category] || defaultTarget;
}

// Utility functions
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDurationDetailed(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}
