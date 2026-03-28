import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Waves, HelpCircle, Play } from "lucide-react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, addToast } from "@heroui/react";
import type { AcousticsRecord } from "../types";
import { usePersistentAcousticsHistory } from "../hooks/usePersistentAcousticsHistory";
import { validateLicense, showUnauthorizedToast } from "@/services/licenseValidator";
import AcousticsForm from "../components/AcousticsForm";
import AcousticsHistoryTable from "../components/AcousticsHistoryTable";
import UnauthorizedAlert from "@components/UnauthorizedAlert";

export default function Acoustics() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { history, addRecord, updateRecord, deleteRecord, clearHistory } = usePersistentAcousticsHistory();
    const [isValid, setisValid] = useState<boolean | null>(null);
    const [editRecord, setEditRecord] = useState<AcousticsRecord | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        validateLicense().then((valid) => {
            setisValid(valid);
            if (!valid) showUnauthorizedToast();
        });
    }, []);

    // Handle edit from URL query parameter (from dashboard)
    useEffect(() => {
        const editId = searchParams.get("edit");
        if (editId && history.length > 0) {
            const record = history.find((r) => r.id === editId);
            if (record) {
                setEditRecord(record);
                setSearchParams({}, { replace: true });
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }, [searchParams, history, setSearchParams]);

    const handleFormSubmit = (record: AcousticsRecord) => {
        if (editRecord) {
            updateRecord(record)
                .then(() => {
                    addToast({
                        title: "Report updated",
                        description: `"${record.analysisName}" has been updated successfully.`,
                        color: "success",
                    });
                })
                .catch((err) => {
                    console.error("Failed to update record:", err);
                    addToast({
                        title: "Update failed",
                        description: "Failed to update the report. Please try again.",
                        color: "danger",
                    });
                });
            setEditRecord(null);
        } else {
            addRecord(record)
                .then(() => {
                    addToast({
                        title: "Report created",
                        description: `"${record.analysisName}" has been created successfully.`,
                        color: "success",
                    });
                })
                .catch((err) => {
                    console.error("Failed to add record:", err);
                    addToast({
                        title: "Creation failed",
                        description: "Failed to create the report. Please try again.",
                        color: "danger",
                    });
                });
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
        const record = history.find((r) => r.id === id);
        deleteRecord(id)
            .then(() => {
                addToast({
                    title: "Report deleted",
                    description: record ? `"${record.analysisName}" has been deleted.` : "Report has been deleted.",
                    color: "success",
                });
            })
            .catch((err) => {
                console.error("Failed to delete record:", err);
                addToast({
                    title: "Delete failed",
                    description: "Failed to delete the report. Please try again.",
                    color: "danger",
                });
            });
        if (editRecord?.id === id) {
            setEditRecord(null);
        }
    };

    const handleClearHistory = () => {
        clearHistory()
            .then(() => {
                addToast({
                    title: "History cleared",
                    description: "All acoustics reports have been deleted.",
                    color: "success",
                });
            })
            .catch((err) => {
                console.error("Failed to clear history:", err);
                addToast({
                    title: "Clear failed",
                    description: "Failed to clear history. Please try again.",
                    color: "danger",
                });
            });
        setEditRecord(null);
    };

    if (isValid === false) return <UnauthorizedAlert />;

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
                                                    Enter room dimensions (L x W x H), select room type and ceiling
                                                    style.
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
                                                    Choose materials for floor, ceiling, and walls from 17 acoustic
                                                    options.
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
                                                    Check the History table to review saved analyses and compare
                                                    results.
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

            <AcousticsForm onSubmit={handleFormSubmit} editRecord={editRecord} onCancelEdit={handleCancelEdit} />

            <AcousticsHistoryTable
                history={history}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
                onEditRecord={handleEditRecord}
            />
        </div>
    );
}
