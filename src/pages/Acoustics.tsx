import { useState, useEffect, useRef } from "react";
import { Waves, Play, HelpCircle } from "lucide-react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                <Button
                    onPress={onOpen}
                    color="success"
                    variant="flat"
                    className="mt-4"
                    startContent={<HelpCircle size={18} />}
                >
                    How to Use
                </Button>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
                    <ModalContent>
                        {() => (
                            <>
                                <ModalHeader className="flex items-center gap-2">
                                    <Play size={20} className="text-success" />
                                    How to Use Space Acoustics
                                </ModalHeader>
                                <ModalBody className="pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold shrink-0 text-sm">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Configure Room</h4>
                                                <p className="text-sm text-default-600">
                                                    Enter room dimensions (L x W x H), select room type and ceiling style.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-bold shrink-0 text-sm">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Select Materials</h4>
                                                <p className="text-sm text-default-600">
                                                    Choose materials for floor, ceiling, and walls from 17 acoustic options.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Set Environment</h4>
                                                <p className="text-sm text-default-600">
                                                    Adjust temperature, humidity, occupancy, windows, and doors.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning text-white font-bold shrink-0 text-sm">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">View Results</h4>
                                                <p className="text-sm text-default-600">
                                                    Check the History table to review saved analyses and compare results.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
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
