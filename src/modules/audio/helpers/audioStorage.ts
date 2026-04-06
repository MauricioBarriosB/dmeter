/*
Audio Analysis Storage - API-based
- loadAudioHistory() - Loads audio analysis records from API
- saveAudioRecord(record) - Saves a single audio record to API
- updateAudioRecord(id, record) - Updates an audio record via API
- deleteAudioRecord(id) - Deletes an audio record via API
- clearAudioHistory() - Removes all audio history via API
*/

import { fetchFromApi } from "@services/apiConfig";
import type { AudioRecord, GenreOption, DistributionType, MediaOption, MasteringTarget } from "../types";

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

    loadingPromise = fetchFromApi<AudioDataResponse>("audio-data")
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
        options.map((opt) => ({ ...opt, category })),
    );
}

// Storage functions - using API
import {
    fetchAudioReports,
    fetchAudioReport,
    createAudioReport,
    updateAudioReport,
    deleteAudioReport,
    clearAudioReports,
} from "@services/apiCrud";

export async function loadAudioHistory(): Promise<AudioRecord[]> {
    try {
        return await fetchAudioReports<AudioRecord>();
    } catch (err) {
        console.error("Failed to load audio history:", err);
        return [];
    }
}

export async function loadAudioRecord(id: string): Promise<AudioRecord | null> {
    try {
        return await fetchAudioReport<AudioRecord>(id);
    } catch (err) {
        console.error("Failed to load audio record:", err);
        return null;
    }
}

export async function saveAudioRecord(record: AudioRecord): Promise<AudioRecord | null> {
    try {
        return await createAudioReport<AudioRecord>(record);
    } catch (err) {
        console.error("Failed to save audio record:", err);
        return null;
    }
}

export async function updateAudioRecord(id: string, record: AudioRecord): Promise<AudioRecord | null> {
    try {
        return await updateAudioReport<AudioRecord>(id, record);
    } catch (err) {
        console.error("Failed to update audio record:", err);
        return null;
    }
}

export async function deleteAudioRecord(id: string): Promise<boolean> {
    try {
        await deleteAudioReport(id);
        return true;
    } catch (err) {
        console.error("Failed to delete audio record:", err);
        return false;
    }
}

export async function clearAudioHistory(): Promise<boolean> {
    try {
        await clearAudioReports();
        return true;
    } catch (err) {
        console.error("Failed to clear audio history:", err);
        return false;
    }
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
    return (
        data.masteringTargets[category] || {
            lufsMin: -14,
            lufsMax: -10,
            dynamicRangeMin: 8,
            dynamicRangeMax: 14,
            description: "Balanced mastering",
        }
    );
}

// Sync helper functions (use cached data)
export function getGenreLabelSync(value: string): string {
    if (!audioDataCache) return value;
    return audioDataCache.genreOptions.find((g) => g.value === value)?.label || value;
}

export function getMediaLabelSync(value: string): string {
    if (!audioDataCache) return value;
    const mediaOptions = Object.entries(audioDataCache.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category })),
    );
    return mediaOptions.find((m) => m.value === value)?.label || value;
}

export function getMediaLufsTargetSync(value: string): number | null {
    if (!audioDataCache) return null;
    const mediaOptions = Object.entries(audioDataCache.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category })),
    );
    const media = mediaOptions.find((m) => m.value === value);
    return media?.lufsTarget ?? null;
}

export function getMediaCategorySync(value: string): string {
    if (!audioDataCache) return "other";
    const mediaOptions = Object.entries(audioDataCache.mediaByDistribution).flatMap(([category, options]) =>
        options.map((opt) => ({ ...opt, category })),
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
