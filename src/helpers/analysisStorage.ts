/*
loadAnalysisHistory() - Loads and parses history from localStorage
saveAnalysisHistory(history) - Saves history to localStorage
clearAnalysisHistory() - Removes history from localStorage (available for future use)
*/

import type { AnalysisRecord } from "../components/AnalysisHistoryTable";

const storageKey: string = import.meta.env.VITE_STORAGE_KEY;
const expectedHash: string = import.meta.env.VITE_STORAGE_KEY_HASH;

let validationState: "pending" | "valid" | "invalid" = "pending";

async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function validateStorageKey(): Promise<boolean> {
    if (validationState === "valid") return true;
    if (validationState === "invalid") return false;

    const hash = await hashKey(storageKey);
    validationState = hash === expectedHash ? "valid" : "invalid";

    if (validationState === "invalid") {
        console.error("Invalid storage key - access denied");
    }
    return validationState === "valid";
}

export async function loadAnalysisHistory(): Promise<AnalysisRecord[]> {
    if (!(await validateStorageKey())) return [];

    const stored = localStorage.getItem(storageKey);
    if (stored) {
        try {
            return JSON.parse(stored) as AnalysisRecord[];
        } catch {
            console.error("Failed to parse stored history");
            return [];
        }
    }
    return [];
}

export async function saveAnalysisHistory(history: AnalysisRecord[]): Promise<void> {
    if (!(await validateStorageKey())) return;
    localStorage.setItem(storageKey, JSON.stringify(history));
}

export async function clearAnalysisHistory(): Promise<void> {
    if (!(await validateStorageKey())) return;
    localStorage.removeItem(storageKey);
}
