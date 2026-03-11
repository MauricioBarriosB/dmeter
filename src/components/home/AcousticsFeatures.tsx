import { BarChart3, Box, Clock, Ruler, Music, Thermometer, Layers, MessageSquare } from "lucide-react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function AcousticsFeatures() {
    return (
        <>
            <p className="text-default-600 mb-4">
                Professional room acoustic analysis with multi-surface materials, environmental factors, and
                frequency-dependent calculations. Designed for audio engineers and acoustic consultants.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Room Configuration */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Box size={20} className="text-primary" />
                            Room Configuration
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">12 Room Types</span>
                                <p className="text-sm text-default-600">
                                    Recording studio, control room, broadcast, home theater, classroom, conference,
                                    auditorium, and more.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">6 Ceiling Types</span>
                                <p className="text-sm text-default-600">
                                    Flat, vault, rectangular, pyramidal, curved, and coffered with volume adjustments.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Multi-Surface Materials */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Layers size={20} className="text-secondary" />
                            Multi-Surface Materials
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">17 Material Options</span>
                                <p className="text-sm text-default-600">
                                    Concrete, brick, wood, carpet, glass, curtains, acoustic tiles, foam, panels,
                                    diffusers, and more.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Per-Surface Selection</span>
                                <p className="text-sm text-default-600">
                                    Different materials for floor, ceiling, and walls with frequency-dependent
                                    absorption coefficients.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Environmental Factors */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Thermometer size={20} className="text-warning" />
                            Environmental Factors
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">Temperature</span>
                                <p className="text-sm text-default-600">
                                    Affects speed of sound calculation (c = 331.3 + 0.606×T).
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Humidity & Occupancy</span>
                                <p className="text-sm text-default-600">
                                    Air absorption at high frequencies and people absorption (~0.5 m² each).
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Speech Intelligibility */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <MessageSquare size={20} className="text-success" />
                            Speech Intelligibility
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">STI Estimation</span>
                                <p className="text-sm text-default-600">
                                    Speech Transmission Index for communication quality assessment.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">C50 & D50</span>
                                <p className="text-sm text-default-600">
                                    Clarity and Definition metrics for speech applications.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Advanced Metrics Title */}
                <h3
                    className="text-2xl font-bold flex items-center gap-2 lg:col-span-2 mt-4"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <BarChart3 size={24} className="text-secondary" />
                    Advanced Metrics
                </h3>

                {/* Reverberation & Clarity */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            Reverberation & Clarity Metrics
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                <h4 className="font-medium text-primary mb-1">RT60</h4>
                                <p className="text-sm text-default-600">Sabine & Eyring formulas</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                                <h4 className="font-medium text-secondary mb-1">EDT</h4>
                                <p className="text-sm text-default-600">Early Decay Time</p>
                            </div>
                            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-medium text-success mb-1">C80</h4>
                                <p className="text-sm text-default-600">Music Clarity (dB)</p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <h4 className="font-medium text-warning mb-1">Bass Ratio</h4>
                                <p className="text-sm text-default-600">Warmth assessment</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Frequency Analysis */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BarChart3 size={20} className="text-secondary" />
                            Frequency-Dependent Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <p className="text-default-600 mb-4">
                            RT60 calculated at 6 octave bands (125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz) using real
                            absorption coefficient data for professional accuracy.
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {[125, 250, 500, 1000, 2000, 4000].map((freq) => (
                                <div
                                    key={freq}
                                    className="p-3 rounded-lg bg-default-100 border border-default-200 text-center"
                                >
                                    <p className="font-semibold">{freq >= 1000 ? `${freq / 1000}k` : freq}</p>
                                    <p className="text-xs text-default-500">Hz</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Advanced Parameters */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Ruler size={20} className="text-danger" />
                            Advanced Parameters
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">Critical Distance</span>
                                <p className="text-sm text-default-600">
                                    Where direct sound equals reverberant sound level.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Mean Free Path</span>
                                <p className="text-sm text-default-600">Average distance between reflections (4V/S).</p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Room Modes */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Music size={20} className="text-danger" />
                            Room Modes Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">Axial Modes</span>
                                <p className="text-sm text-default-600">
                                    Length, width, and height modes with Schroeder frequency threshold.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Recommendations</span>
                                <p className="text-sm text-default-600">
                                    Intelligent suggestions for acoustic treatment based on analysis.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
