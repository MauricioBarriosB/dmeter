import { useState, useEffect, useRef, useCallback } from "react";
import {
    fetchTimeReports,
    createTimeReport,
    updateTimeReport,
    deleteTimeReport,
    clearTimeReports,
} from "@services/apiCrud";
import type { TimeReportRecord } from "../types";

export function usePersistentTimeHistory() {
    const [history, setHistory] = useState<TimeReportRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        fetchTimeReports()
            .then((loaded) => {
                setHistory(loaded);
                isLoaded.current = true;
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load time history:", err);
                setError("Failed to load time history");
                setIsLoading(false);
            });
    }, []);

    const addRecord = useCallback(async (record: TimeReportRecord) => {
        try {
            await createTimeReport(record);
            setHistory((prev) => [record, ...prev]);
        } catch (err) {
            console.error("Failed to create time report:", err);
            throw err;
        }
    }, []);

    const updateRecord = useCallback(async (record: TimeReportRecord) => {
        try {
            await updateTimeReport(record.id, record);
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
        } catch (err) {
            console.error("Failed to update time report:", err);
            throw err;
        }
    }, []);

    const deleteRecord = useCallback(async (id: string) => {
        try {
            await deleteTimeReport(id);
            setHistory((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete time report:", err);
            throw err;
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await clearTimeReports();
            setHistory([]);
        } catch (err) {
            console.error("Failed to clear time history:", err);
            throw err;
        }
    }, []);

    return { history, isLoading, error, addRecord, updateRecord, deleteRecord, clearHistory };
}
