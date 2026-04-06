import { Play, HelpCircle } from "lucide-react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";

export interface HowToUseStep {
    number: number;
    title: string;
    description: string;
}

const stepColors = [
    "bg-secondary",
    "bg-success",
    "bg-primary",
    "bg-warning",
    "bg-danger",
    "bg-secondary",
    "bg-success",
    "bg-primary",
];

interface HowToUseProps {
    title: string;
    steps: HowToUseStep[];
}

export default function HowToUse({ title, steps }: Readonly<HowToUseProps>) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const gridColsMap: Record<number, string> = {
        1: "lg:grid-cols-1",
        2: "lg:grid-cols-2",
        3: "lg:grid-cols-3",
        4: "lg:grid-cols-4",
        5: "lg:grid-cols-5",
        6: "lg:grid-cols-6",
    };
    const gridCols = gridColsMap[steps.length] || "lg:grid-cols-5";

    return (
        <>
            <Button
                onPress={onOpen}
                color="success"
                variant="flat"
                className="mt-4"
                startContent={<HelpCircle size={18} />}
            >
                How to Use
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex items-center gap-2">
                                <Play size={20} className="text-success" />
                                {title}
                            </ModalHeader>
                            <ModalBody className="pb-6">
                                <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-4`}>
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex items-start gap-3">
                                            <div
                                                className={`flex items-center justify-center w-6 h-6 rounded-full ${stepColors[index % stepColors.length]} text-white font-bold shrink-0 text-sm`}
                                            >
                                                {step.number}
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">{step.title}</h4>
                                                <p className="text-sm text-default-600">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
