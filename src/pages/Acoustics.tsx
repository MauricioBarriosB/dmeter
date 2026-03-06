import { useState, useEffect, useRef } from "react";
import { Waves } from "lucide-react";
import { loadAcousticsHistory, saveAcousticsHistory, type AcousticsRecord } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import AcousticsForm from "../components/AcousticsForm";
import AcousticsHistoryTable from "../components/AcousticsHistoryTable";
import LicenseInvalid from "../components/LicenseInvalid";

export default function Acoustics() {
    const [history, setHistory] = useState<AcousticsRecord[]>([]);
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [editRecord, setEditRecord] = useState<AcousticsRecord | null>(null);
    const historyLoaded = useRef(false);

    useEffect(() => {
        validateLicense().then(setisValid);
        loadAcousticsHistory().then((loaded) => {
            setHistory(loaded);
            historyLoaded.current = true;
        });
    }, []);

    useEffect(() => {
        if (!historyLoaded.current) return;
        saveAcousticsHistory(history);
    }, [history]);

    const handleFormSubmit = (record: AcousticsRecord) => {
        if (editRecord) {
            setHistory((prev) => prev.map((r) => (r.id === record.id ? record : r)));
            setEditRecord(null);
        } else {
            setHistory((prev) => [record, ...prev]);
        }
    };

    const handleEditRecord = (record: AcousticsRecord) => {
        setEditRecord(record);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditRecord(null);
    };

    const handleDeleteRecord = (id: string) => {
        setHistory((prev) => prev.filter((record) => record.id !== id));
        if (editRecord?.id === id) {
            setEditRecord(null);
        }
    };

    const handleClearHistory = () => {
        setHistory([]);
        setEditRecord(null);
    };

    if (isValid === null) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-lg text-default-500">Validating license...</p>
            </div>
        );
    }

    if (!isValid) return <LicenseInvalid />;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <Waves size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Space Acoustics
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Professional room acoustic analysis with multi-surface materials, environmental factors, and
                    frequency-dependent calculations for audio engineers.
                </p>
            </div>

            <AcousticsForm
                onSubmit={handleFormSubmit}
                editRecord={editRecord}
                onCancelEdit={handleCancelEdit}
            />

            <AcousticsHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
                onEditRecord={handleEditRecord}
            />
        </div>
    );
}
