import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Divider } from "@heroui/react";
import type { AcousticsRecord } from "../helpers/analysisStorage";

interface AcousticsFormData {
    analysisName: string;
    roomHeight: string;
    roomWidth: string;
    roomDepth: string;
    roomPurpose: string;
    roofType: string;
    floorMaterial: string;
    ceilingMaterial: string;
    wallMaterial: string;
    temperature: string;
    humidity: string;
    occupancy: string;
    windowArea: string;
    doorCount: string;
}

const roomPurposeOptions = [
    { key: "recording_studio", label: "Recording Studio" },
    { key: "control_room", label: "Control Room" },
    { key: "broadcast", label: "Broadcast Studio" },
    { key: "rehearsal", label: "Rehearsal Room" },
    { key: "concert", label: "Concert Hall" },
    { key: "home_theater", label: "Home Theater" },
    { key: "classroom", label: "Classroom" },
    { key: "conference", label: "Conference Room" },
    { key: "auditorium", label: "Auditorium" },
    { key: "parlor", label: "Parlor" },
    { key: "reading", label: "Reading Room" },
    { key: "library", label: "Library" },
];

const roofTypeOptions = [
    { key: "flat", label: "Flat" },
    { key: "vault", label: "Vault" },
    { key: "rectangular", label: "Rectangular" },
    { key: "pyramidal", label: "Pyramidal" },
    { key: "curved", label: "Curved" },
    { key: "coffered", label: "Coffered" },
];

const materialOptions = [
    { key: "concrete", label: "Concrete/Painted" },
    { key: "brick", label: "Brick (Unglazed)" },
    { key: "plaster", label: "Plaster/Gypsum" },
    { key: "wood_panel", label: "Wood Paneling" },
    { key: "wood_floor", label: "Wood Floor" },
    { key: "carpet_thin", label: "Carpet (Thin)" },
    { key: "carpet_thick", label: "Carpet (Heavy)" },
    { key: "tile", label: "Ceramic Tile" },
    { key: "glass", label: "Glass" },
    { key: "curtain_light", label: "Curtains (Light)" },
    { key: "curtain_heavy", label: "Curtains (Heavy)" },
    { key: "acoustic_tile", label: "Acoustic Ceiling Tile" },
    { key: "acoustic_foam", label: "Acoustic Foam" },
    { key: "acoustic_panel", label: "Acoustic Panel" },
    { key: "fabric_panel", label: "Fabric-wrapped Panel" },
    { key: "perforated", label: "Perforated Panel" },
    { key: "diffuser", label: "Diffuser Panel" },
];

const initialFormData: AcousticsFormData = {
    analysisName: "",
    roomHeight: "",
    roomWidth: "",
    roomDepth: "",
    roomPurpose: "",
    roofType: "",
    floorMaterial: "",
    ceilingMaterial: "",
    wallMaterial: "",
    temperature: "20",
    humidity: "50",
    occupancy: "0",
    windowArea: "0",
    doorCount: "1",
};

interface AcousticsFormProps {
    onSubmit: (record: AcousticsRecord) => void;
    editRecord?: AcousticsRecord | null;
    onCancelEdit?: () => void;
}

export default function AcousticsForm({ onSubmit, editRecord, onCancelEdit }: AcousticsFormProps) {
    const [formData, setFormData] = useState<AcousticsFormData>(initialFormData);

    useEffect(() => {
        if (editRecord) {
            setFormData({
                analysisName: editRecord.analysisName,
                roomHeight: editRecord.roomHeight,
                roomWidth: editRecord.roomWidth,
                roomDepth: editRecord.roomDepth,
                roomPurpose: editRecord.roomPurpose,
                roofType: editRecord.roofType,
                floorMaterial: editRecord.floorMaterial,
                ceilingMaterial: editRecord.ceilingMaterial,
                wallMaterial: editRecord.wallMaterial,
                temperature: editRecord.temperature,
                humidity: editRecord.humidity,
                occupancy: editRecord.occupancy,
                windowArea: editRecord.windowArea,
                doorCount: editRecord.doorCount,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editRecord]);

    const handleInputChange = (field: keyof AcousticsFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const record: AcousticsRecord = {
            id: editRecord?.id || crypto.randomUUID(),
            analysisName: formData.analysisName.trim() || `Analysis ${new Date().toLocaleString()}`,
            roomHeight: formData.roomHeight,
            roomWidth: formData.roomWidth,
            roomDepth: formData.roomDepth,
            roomPurpose: formData.roomPurpose,
            roofType: formData.roofType,
            floorMaterial: formData.floorMaterial,
            ceilingMaterial: formData.ceilingMaterial,
            wallMaterial: formData.wallMaterial,
            temperature: formData.temperature,
            humidity: formData.humidity,
            occupancy: formData.occupancy,
            windowArea: formData.windowArea,
            doorCount: formData.doorCount,
            date: editRecord?.date || new Date().toISOString(),
        };

        onSubmit(record);
        setFormData(initialFormData);
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        onCancelEdit?.();
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-semibold">
                    {editRecord ? "Edit Analysis" : "Room Configuration"}
                </h2>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input
                        label="Analysis Name"
                        placeholder="Enter analysis name"
                        value={formData.analysisName}
                        onValueChange={(value) => handleInputChange("analysisName", value)}
                        isRequired
                    />

                    <Divider />
                    <h3 className="text-lg font-semibold text-default-700">Room Dimensions</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            type="number"
                            label="Room Height (m)"
                            placeholder="e.g. 3.5"
                            value={formData.roomHeight}
                            onValueChange={(value) => handleInputChange("roomHeight", value)}
                            min={0}
                            step={0.1}
                            isRequired
                        />
                        <Input
                            type="number"
                            label="Room Width (m)"
                            placeholder="e.g. 5.0"
                            value={formData.roomWidth}
                            onValueChange={(value) => handleInputChange("roomWidth", value)}
                            min={0}
                            step={0.1}
                            isRequired
                        />
                        <Input
                            type="number"
                            label="Room Depth (m)"
                            placeholder="e.g. 7.0"
                            value={formData.roomDepth}
                            onValueChange={(value) => handleInputChange("roomDepth", value)}
                            min={0}
                            step={0.1}
                            isRequired
                        />
                    </div>

                    <Divider />
                    <h3 className="text-lg font-semibold text-default-700">Room Type & Structure</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Room Purpose"
                            placeholder="Select room purpose"
                            selectedKeys={formData.roomPurpose ? [formData.roomPurpose] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                handleInputChange("roomPurpose", selected || "");
                            }}
                            isRequired
                        >
                            {roomPurposeOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Ceiling/Roof Type"
                            placeholder="Select roof type"
                            selectedKeys={formData.roofType ? [formData.roofType] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                handleInputChange("roofType", selected || "");
                            }}
                            isRequired
                        >
                            {roofTypeOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Divider />
                    <h3 className="text-lg font-semibold text-default-700">Surface Materials</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Floor Material"
                            placeholder="Select floor material"
                            selectedKeys={formData.floorMaterial ? [formData.floorMaterial] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                handleInputChange("floorMaterial", selected || "");
                            }}
                            isRequired
                        >
                            {materialOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Ceiling Material"
                            placeholder="Select ceiling material"
                            selectedKeys={formData.ceilingMaterial ? [formData.ceilingMaterial] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                handleInputChange("ceilingMaterial", selected || "");
                            }}
                            isRequired
                        >
                            {materialOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Wall Material"
                            placeholder="Select wall material"
                            selectedKeys={formData.wallMaterial ? [formData.wallMaterial] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                handleInputChange("wallMaterial", selected || "");
                            }}
                            isRequired
                        >
                            {materialOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Divider />
                    <h3 className="text-lg font-semibold text-default-700">Environmental Factors</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            type="number"
                            label="Temperature (C)"
                            placeholder="e.g. 20"
                            value={formData.temperature}
                            onValueChange={(value) => handleInputChange("temperature", value)}
                            min={-10}
                            max={50}
                            step={1}
                            description="Affects speed of sound"
                        />
                        <Input
                            type="number"
                            label="Humidity (%)"
                            placeholder="e.g. 50"
                            value={formData.humidity}
                            onValueChange={(value) => handleInputChange("humidity", value)}
                            min={0}
                            max={100}
                            step={5}
                            description="Affects high-freq absorption"
                        />
                        <Input
                            type="number"
                            label="Expected Occupancy"
                            placeholder="e.g. 10"
                            value={formData.occupancy}
                            onValueChange={(value) => handleInputChange("occupancy", value)}
                            min={0}
                            step={1}
                            description="People absorb ~0.5 m2 each"
                        />
                    </div>

                    <Divider />
                    <h3 className="text-lg font-semibold text-default-700">Additional Elements</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Window Area (m2)"
                            placeholder="e.g. 4"
                            value={formData.windowArea}
                            onValueChange={(value) => handleInputChange("windowArea", value)}
                            min={0}
                            step={0.5}
                            description="Total glass surface area"
                        />
                        <Input
                            type="number"
                            label="Number of Doors"
                            placeholder="e.g. 2"
                            value={formData.doorCount}
                            onValueChange={(value) => handleInputChange("doorCount", value)}
                            min={0}
                            step={1}
                            description="Standard doors (~1.8 m2 each)"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {editRecord && (
                            <Button type="button" color="default" variant="flat" size="lg" onPress={handleCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" color="primary" size="lg">
                            {editRecord ? "Update Analysis" : "Analyze Room"}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
