import { useState, useEffect, useRef, useCallback } from "react";
import {
    fetchInstrumentsReports,
    createInstrumentsReport,
    updateInstrumentsReport,
    deleteInstrumentsReport,
    clearInstrumentsReports,
} from "@services/apiCrud";
import type { InstrumentsReportRecord } from "../types";

export function usePersistentInstrumentsHistory() {
    const [history, setHistory] = useState<InstrumentsReportRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        fetchInstrumentsReports()
            .then((loaded) => {
                setHistory(loaded);
                isLoaded.current = true;
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load instruments history:", err);
                setError("Failed to load instruments history");
                setIsLoading(false);
            });
    }, []);

    const addRecord = useCallback(async (record: InstrumentsReportRecord) => {
        try {
            await createInstrumentsReport(record);
            setHistory((prev) => [record, ...prev]);
        } catch (err) {
            console.error("Failed to create instruments report:", err);
            throw err;
        }
    }, []);

    const updateRecord = useCallback(async (record: InstrumentsReportRecord) => {
        try {
            await updateInstrumentsReport(record.id, record);
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
        } catch (err) {
            console.error("Failed to update instruments report:", err);
            throw err;
        }
    }, []);

    const deleteRecord = useCallback(async (id: string) => {
        try {
            await deleteInstrumentsReport(id);
            setHistory((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete instruments report:", err);
            throw err;
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await clearInstrumentsReports();
            setHistory([]);
        } catch (err) {
            console.error("Failed to clear instruments history:", err);
            throw err;
        }
    }, []);

    return { history, isLoading, error, addRecord, updateRecord, deleteRecord, clearHistory };
}
