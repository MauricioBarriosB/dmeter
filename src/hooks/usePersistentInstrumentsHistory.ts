import { useState, useEffect, useRef, useCallback } from "react";
import { loadInstrumentsHistory, saveInstrumentsHistory, type InstrumentsReportRecord } from "../helpers/analysisStorage";

export function usePersistentInstrumentsHistory() {
    const [history, setHistory] = useState<InstrumentsReportRecord[]>([]);
    const isLoaded = useRef(false);

    useEffect(() => {
        loadInstrumentsHistory().then((loaded) => {
            setHistory(loaded);
            isLoaded.current = true;
        });
    }, []);

    useEffect(() => {
        if (!isLoaded.current) return;
        saveInstrumentsHistory(history);
    }, [history]);

    const addRecord = useCallback((record: InstrumentsReportRecord) => {
        setHistory((prev) => [record, ...prev]);
    }, []);

    const updateRecord = useCallback((record: InstrumentsReportRecord) => {
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
