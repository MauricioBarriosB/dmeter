import { Clock, Sliders, Music, Database } from "lucide-react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function TimeFeatures() {
    return (
        <>
            <p className="text-default-600 mb-4">
                Professional BPM-synced calculator for reverberation and delay times. Computes precise DAW plugin preset
                values, tempo-locked pre-delay, note subdivisions, and per-repeat decay analysis based on your song's BPM
                and time signature.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Track Types */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Music size={20} className="text-primary" />
                            30 Track Types
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "Vocals (Lead)", "Backing Vocals", "Screaming", "Spoken Word",
                                "Clean Guitar", "Acoustic Guitar", "Crunch / Rhythm", "Lead Guitar / Solo",
                                "High Gain / Metal", "Drop Tuning / Djent", "Bass Guitar", "Distorted Bass",
                                "Kick Drum", "Snare Drum", "Toms", "Overheads / Cymbals",
                                "Piano / Keys", "Synth Pad", "Synth Lead", "Organ",
                                "Strings", "Brass / Horns", "Woodwinds", "Sound FX",
                            ].map((type) => (
                                <div key={type} className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                                    {type}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Environments & Delay Types */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock size={20} className="text-secondary" />
                            12 Reverb Environments + 7 Delay Types
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <h4 className="font-medium text-default-700 mb-2">Reverb Environments</h4>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[
                                "Concert Hall", "Large Hall", "Chamber", "Room",
                                "Small Room", "Plate", "Spring", "Cathedral",
                                "Arena / Stadium", "Warehouse", "Bathroom / Tile", "Ambient",
                            ].map((env) => (
                                <div key={env} className="p-2 rounded-lg bg-secondary/5 border border-secondary/10 text-sm">
                                    {env}
                                </div>
                            ))}
                        </div>
                        <h4 className="font-medium text-default-700 mb-2">Delay Types</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {["Mono", "Stereo", "Ping Pong", "Tape", "Analog", "Digital", "Modulated"].map((dt) => (
                                <div key={dt} className="p-2 rounded-lg bg-warning/5 border border-warning/10 text-sm">
                                    {dt}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Calculation Features */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Sliders size={20} className="text-warning" />
                            Professional Calculation Engine
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">BPM-Synced Reverb</h4>
                                <p className="text-sm text-default-600">
                                    RT60, pre-delay, and decay time computed as musical fractions of bar length from BPM and time signature.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary mb-2">DAW Plugin Preset</h4>
                                <p className="text-sm text-default-600">
                                    Ready-to-use preset values: pre-delay, decay, size, damping, diffusion, EQ, wet/dry per track type.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">Note Subdivisions</h4>
                                <p className="text-sm text-default-600">
                                    Complete table of 14+ note values with ms, seconds, and Hz (LFO sync) at your exact BPM.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-danger/10 border border-danger/20">
                                <h4 className="font-medium text-danger mb-2">Delay Decay Analysis</h4>
                                <p className="text-sm text-default-600">
                                    Per-repeat amplitude decay in dB and %, audibility markers, total decay time with feedback.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-2">13 Time Signatures</h4>
                                <p className="text-sm text-default-600">
                                    2/2, 2/4, 3/4, 4/4, 5/4, 6/4, 7/4, 3/8, 5/8, 6/8, 7/8, 9/8, 12/8 — bar length adjusts all calculations.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-default/10 border border-default/20">
                                <h4 className="font-medium text-default-700 mb-2">Auto-Calculation</h4>
                                <p className="text-sm text-default-600">
                                    Reverb time and pre-delay update instantly when you change BPM, time signature, or environment.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">Track-Type EQ</h4>
                                <p className="text-sm text-default-600">
                                    Recommended high/low cut and wet/dry per track type — from tight kick drums to ambient pads.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary mb-2">Pre-Delay Options</h4>
                                <p className="text-sm text-default-600">
                                    BPM-synced pre-delay table (1/64 to 1/8 note) with recommended pick for transient clarity.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Report Management */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Database size={20} className="text-warning" />
                            Report Management
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-2">Create & Edit</h4>
                                <p className="text-sm text-default-600">
                                    Generate new time reports or edit existing ones with full form validation and auto-compute.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">Persistent Storage</h4>
                                <p className="text-sm text-default-600">
                                    All reports automatically saved to database for persistence across sessions.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">Detail Reports</h4>
                                <p className="text-sm text-default-600">
                                    View complete DAW presets, note subdivision tables, and user vs recommended comparison.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
