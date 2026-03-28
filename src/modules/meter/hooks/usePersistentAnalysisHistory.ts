import { useState, useEffect, useRef, useCallback } from "react";
import type { AnalysisRecord } from "@modules/meter/types";
import {
    fetchAnalysisReports,
    createAnalysisReport,
    updateAnalysisReport,
    deleteAnalysisReport,
    clearAnalysisReports,
} from "@services/apiCrud";

export function usePersistentAnalysisHistory() {
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        fetchAnalysisReports()
            .then((loaded) => {
                setHistory(loaded);
                isLoaded.current = true;
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load analysis history:", err);
                setError("Failed to load analysis history");
                setIsLoading(false);
            });
    }, []);

    const addRecord = useCallback(async (record: AnalysisRecord) => {
        try {
            await createAnalysisReport(record);
            setHistory((prev) => [record, ...prev]);
        } catch (err) {
            console.error("Failed to create analysis report:", err);
            throw err;
        }
    }, []);

    const updateRecord = useCallback(async (record: AnalysisRecord) => {
        try {
            await updateAnalysisReport(record.id, record);
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
        } catch (err) {
            console.error("Failed to update analysis report:", err);
            throw err;
        }
    }, []);

    const deleteRecord = useCallback(async (id: string) => {
        try {
            await deleteAnalysisReport(id);
            setHistory((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete analysis report:", err);
            throw err;
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await clearAnalysisReports();
            setHistory([]);
        } catch (err) {
            console.error("Failed to clear analysis history:", err);
            throw err;
        }
    }, []);

    return { history, isLoading, error, addRecord, updateRecord, deleteRecord, clearHistory };
}
