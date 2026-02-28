/*
loadAnalysisHistory() - Loads and parses history from localStorage
saveAnalysisHistory(history) - Saves history to localStorage
clearAnalysisHistory() - Removes history from localStorage (available for future use)
*/


import type { AnalysisRecord } from "../components/AnalysisHistoryTable";

const STORAGE_KEY = "dmeter_analysis_history_20260228";

export function loadAnalysisHistory(): AnalysisRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
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

export function saveAnalysisHistory(history: AnalysisRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearAnalysisHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
