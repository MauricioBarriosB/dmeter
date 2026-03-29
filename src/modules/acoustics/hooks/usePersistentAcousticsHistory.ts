import { useState, useEffect, useRef, useCallback } from "react";
import {
    fetchAcousticsReports,
    createAcousticsReport,
    updateAcousticsReport,
    deleteAcousticsReport,
    clearAcousticsReports,
} from "@services/apiCrud";
import type { AcousticsRecord } from "@modules/acoustics/types";

export function usePersistentAcousticsHistory() {
    const [history, setHistory] = useState<AcousticsRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        fetchAcousticsReports()
            .then((loaded) => {
                setHistory(loaded);
                isLoaded.current = true;
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load acoustics history:", err);
                setError("Failed to load acoustics history");
                setIsLoading(false);
            });
    }, []);

    const addRecord = useCallback(async (record: AcousticsRecord) => {
        try {
            await createAcousticsReport(record);
            setHistory((prev) => [record, ...prev]);
        } catch (err) {
            console.error("Failed to create acoustics report:", err);
            throw err;
        }
    }, []);

    const updateRecord = useCallback(async (record: AcousticsRecord) => {
        try {
            await updateAcousticsReport(record.id, record);
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
        } catch (err) {
            console.error("Failed to update acoustics report:", err);
            throw err;
        }
    }, []);

    const deleteRecord = useCallback(async (id: string) => {
        try {
            await deleteAcousticsReport(id);
            setHistory((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete acoustics report:", err);
            throw err;
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await clearAcousticsReports();
            setHistory([]);
        } catch (err) {
            console.error("Failed to clear acoustics history:", err);
            throw err;
        }
    }, []);

    return { history, isLoading, error, addRecord, updateRecord, deleteRecord, clearHistory };
}
