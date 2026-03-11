import { BarChart3, Box, Layers, Package, Shield } from "lucide-react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function MaterialsFeatures() {
    return (
        <>
            <p className="text-default-600 mb-4">
                Generate comprehensive material lists for building audio studios, home studios, rehearsal rooms, and
                professional acoustic spaces. Choose from 12 build types and 59 specialized materials across 8
                categories.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Build Types */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Box size={20} className="text-primary" />
                            12 Build Types
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "Recording Studio",
                                "Home Studio",
                                "Rehearsal Room",
                                "Control Room",
                                "Broadcast Studio",
                                "Podcast Room",
                                "Voiceover Booth",
                                "Mixing Room",
                                "Mastering Suite",
                                "Live Room",
                                "Isolation Booth",
                                "Home Theater",
                            ].map((type) => (
                                <div
                                    key={type}
                                    className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-sm"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Acoustic Treatment - 4 Categories */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Package size={20} className="text-secondary" />
                            22 Acoustic Treatment Options
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary text-sm mb-1">Absorption Panels (5)</h4>
                                <p className="text-xs text-default-600">
                                    Acoustic Foam, Fabric-Wrapped Panels, Wooden Slats, Perforated Wood, Acoustic Fabric
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                                <h4 className="font-medium text-danger text-sm mb-1">Bass Control (4)</h4>
                                <p className="text-xs text-default-600">
                                    Bass Traps, Corner Bass Traps, Helmholtz Resonators, Membrane Absorbers
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning text-sm mb-1">Diffusion (4)</h4>
                                <p className="text-xs text-default-600">
                                    Diffuser Panels, QRD Diffusers, Skyline Diffusers, Polycylindrical Diffusers
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success text-sm mb-1">Ceiling & Portable (9)</h4>
                                <p className="text-xs text-default-600">
                                    Ceiling Tiles, Cloud Panels, Baffles, Curtains, Gobos, Vocal Booth, Reflection
                                    Filter, Isolation Pads
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Construction & Soundproofing - 4 Categories */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Shield size={20} className="text-primary" />
                            37 Construction & Soundproofing Materials
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">Wall Systems (12)</h4>
                                <p className="text-sm text-default-600">
                                    Concrete Blocks, Staggered/Double Stud Walls, Plywood, MDF, Rockwool, Fiberglass,
                                    MLV, Green Glue, Resilient Channels, Drywall
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-default/10 border border-default/20">
                                <h4 className="font-medium text-default-700 mb-2">Sealing & Openings (10)</h4>
                                <p className="text-sm text-default-600">
                                    Acoustic Caulk, Sealants, Weatherstripping, Putty Pads, Door Seals, Soundproof
                                    Doors, Window Plugs, Double Glazing, Studio Glass
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary mb-2">Floor & Vibration (9)</h4>
                                <p className="text-sm text-default-600">
                                    Carpet Underlay, Rubber/Cork Flooring, Neoprene/Sorbothane Pads, Spring/Joist
                                    Isolators, Floating Floor, Drum Riser
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">Ceiling & HVAC (6)</h4>
                                <p className="text-sm text-default-600">
                                    Suspended Ceiling, Isolation Hangers, Duct Silencers, Flexible Duct, Acoustic
                                    Ventilation, Cable Management
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Absorption Coefficients Analysis */}
                <h3
                    className="text-2xl font-bold flex items-center gap-2 lg:col-span-2 mt-4"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <BarChart3 size={24} className="text-secondary" />
                    17 Surface Materials - Absorption Analysis
                </h3>

                {/* Hard Surfaces */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Layers size={20} className="text-danger" />
                            Hard Surfaces (Low Absorption)
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Concrete/Painted</span>
                                <span className="text-danger font-medium">0.01 - 0.03</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Brick (Unglazed)</span>
                                <span className="text-danger font-medium">0.03 - 0.07</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Plaster/Gypsum</span>
                                <span className="text-danger font-medium">0.02 - 0.05</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Ceramic Tile</span>
                                <span className="text-danger font-medium">0.01 - 0.02</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Glass</span>
                                <span className="text-warning font-medium">0.04 - 0.35</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Wood & Fabric */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Layers size={20} className="text-warning" />
                            Wood & Fabric (Medium Absorption)
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Wood Paneling</span>
                                <span className="text-warning font-medium">0.06 - 0.15</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Wood Floor</span>
                                <span className="text-warning font-medium">0.06 - 0.15</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Carpet (Thin)</span>
                                <span className="text-warning font-medium">0.05 - 0.50</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Carpet (Heavy)</span>
                                <span className="text-success font-medium">0.10 - 0.65</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Curtains (Light)</span>
                                <span className="text-warning font-medium">0.05 - 0.45</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Curtains (Heavy)</span>
                                <span className="text-success font-medium">0.15 - 0.70</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Acoustic Treatment */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Layers size={20} className="text-success" />
                            Acoustic Treatment (High Absorption)
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-1">Acoustic Ceiling Tile</h4>
                                <p className="text-sm text-default-600">0.50 - 0.80 coefficient</p>
                            </div>
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-1">Acoustic Foam</h4>
                                <p className="text-sm text-default-600">0.10 - 0.90 coefficient</p>
                            </div>
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-1">Acoustic Panel</h4>
                                <p className="text-sm text-default-600">0.30 - 0.85 coefficient</p>
                            </div>
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-1">Fabric-wrapped Panel</h4>
                                <p className="text-sm text-default-600">0.20 - 0.85 coefficient</p>
                            </div>
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-1">Perforated Panel</h4>
                                <p className="text-sm text-default-600">0.35 - 0.90 coefficient</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary mb-1">Diffuser Panel</h4>
                                <p className="text-sm text-default-600">0.15 - 0.60 coefficient</p>
                            </div>
                        </div>
                        <p className="text-xs text-default-500 mt-4">
                            Absorption coefficients vary by frequency (125Hz - 4kHz). Higher values indicate more sound
                            absorption.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
