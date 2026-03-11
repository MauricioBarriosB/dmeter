import { useState, useEffect, useRef, useCallback } from "react";
import { loadMaterialsHistory, saveMaterialsHistory, type MaterialsReportRecord } from "../helpers/analysisStorage";

export function usePersistentMaterialsHistory() {
    const [history, setHistory] = useState<MaterialsReportRecord[]>([]);
    const isLoaded = useRef(false);

    useEffect(() => {
        loadMaterialsHistory().then((loaded) => {
            setHistory(loaded);
            isLoaded.current = true;
        });
    }, []);

    useEffect(() => {
        if (!isLoaded.current) return;
        saveMaterialsHistory(history);
    }, [history]);

    const addRecord = useCallback((record: MaterialsReportRecord) => {
        setHistory((prev) => [record, ...prev]);
    }, []);

    const updateRecord = useCallback((record: MaterialsReportRecord) => {
        setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
    }, []);

    const deleteRecord = useCallback((id: string) => {
        setHistory((prev) => prev.filter((r) => r.id !== id));
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return { history, addRecord, updateRecord, deleteRecord, clearHistory };
}
