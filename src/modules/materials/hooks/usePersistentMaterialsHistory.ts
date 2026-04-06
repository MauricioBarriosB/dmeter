import { useState, useEffect, useRef, useCallback } from "react";
import {
    fetchMaterialsReports,
    createMaterialsReport,
    updateMaterialsReport,
    deleteMaterialsReport,
    clearMaterialsReports,
} from "@services/apiCrud";
import type { MaterialsReportRecord } from "../types";

export function usePersistentMaterialsHistory() {
    const [history, setHistory] = useState<MaterialsReportRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        fetchMaterialsReports()
            .then((loaded) => {
                setHistory(loaded);
                isLoaded.current = true;
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load materials history:", err);
                setError("Failed to load materials history");
                setIsLoading(false);
            });
    }, []);

    const addRecord = useCallback(async (record: MaterialsReportRecord) => {
        try {
            await createMaterialsReport(record);
            setHistory((prev) => [record, ...prev]);
        } catch (err) {
            console.error("Failed to create materials report:", err);
            throw err;
        }
    }, []);

    const updateRecord = useCallback(async (record: MaterialsReportRecord) => {
        try {
            await updateMaterialsReport(record.id, record);
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
        } catch (err) {
            console.error("Failed to update materials report:", err);
            throw err;
        }
    }, []);

    const deleteRecord = useCallback(async (id: string) => {
        try {
            await deleteMaterialsReport(id);
            setHistory((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete materials report:", err);
            throw err;
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await clearMaterialsReports();
            setHistory([]);
        } catch (err) {
            console.error("Failed to clear materials history:", err);
            throw err;
        }
    }, []);

    return { history, isLoading, error, addRecord, updateRecord, deleteRecord, clearHistory };
}
