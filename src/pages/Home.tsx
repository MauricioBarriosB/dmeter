import {
    Home as HomeIcon,
    Mic,
    Activity,
    Database,
    History,
    Trash2,
    Gauge,
    Waves,
    BarChart3,
    Volume2,
    VolumeX,
    Target,
    Box,
    Clock,
    Ruler,
    Music,
    Thermometer,
    Layers,
    MessageSquare,
    FileText,
    Package,
    Shield,
} from "lucide-react";
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <HomeIcon size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        About DMeter
                    </h1>
                </div>
                <ul className="text-lg text-default-600 font-normal list-disc ml-5 space-y-1">
                    <li>
                        Analyze audio input from your microphone with real-time decibel monitoring. Track current, peak,
                        average, and range dB values while viewing a live frequency spectrum visualization.
                    </li>
                    <li>
                        Calculate room acoustics with professional RT60, speech intelligibility metrics, and
                        frequency-dependent analysis for audio engineers and acoustic consultants.
                    </li>
                    <li>
                        Generate comprehensive materials reports for building professional acoustic spaces with 12 build
                        types, 15 acoustic treatment options, and 19 insulation materials.
                    </li>
                    <li>
                        Create instrument lists for musical ensembles with 12 ensemble types, 14 genres, and 100+
                        instruments across 8 categories including rock, strings, woodwinds, brass, percussion, keyboards,
                        electronic, and ethnic instruments.
                    </li>
                    <li>All analysis sessions and reports are automatically saved for review and comparison.</li>
                </ul>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                    <Button
                        as={Link}
                        to="/meter"
                        color="primary"
                        size="lg"
                        variant="shadow"
                        className="font-semibold text-lg px-8 w-full sm:w-auto"
                        startContent={<Mic size={20} />}
                    >
                        Meter
                    </Button>
                    <Button
                        as={Link}
                        to="/acoustics"
                        color="secondary"
                        size="lg"
                        variant="shadow"
                        className="font-semibold text-lg px-8 w-full sm:w-auto"
                        startContent={<Waves size={20} />}
                    >
                        Acoustics
                    </Button>
                    <Button
                        as={Link}
                        to="/materials"
                        color="danger"
                        size="lg"
                        variant="shadow"
                        className="font-semibold text-lg px-8 w-full sm:w-auto"
                        startContent={<FileText size={20} />}
                    >
                        Materials
                    </Button>
                    <Button
                        as={Link}
                        to="/instruments"
                        color="success"
                        size="lg"
                        variant="shadow"
                        className="font-semibold text-lg px-8 text-white w-full sm:w-auto bg-green-600"
                        startContent={<Music size={20} />}
                    >
                        Instruments
                    </Button>
                </div>
            </div>

            {/* Features Accordion */}
            <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["meter"]}>
                {/* Audio Meter Features */}
                <AccordionItem
                    key="meter"
                    aria-label="Audio Meter Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Mic size={24} className="text-warning" />
                            Audio Meter Features
                        </span>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    <Card className="bg-default-50">
                        <CardBody className="flex flex-row items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Mic size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Web Audio API</h3>
                                <p className="text-sm text-default-600">
                                    Captures microphone input with disabled echo cancellation, noise suppression, and
                                    auto gain for accurate readings.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50">
                        <CardBody className="flex flex-row items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/10">
                                <Waves size={24} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Spectrum Visualization</h3>
                                <p className="text-sm text-default-600">
                                    Real-time spectrum display with rainbow gradient, LED bars, and peak detection using
                                    audiomotion-analyzer.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50">
                        <CardBody className="flex flex-row items-start gap-4">
                            <div className="p-2 rounded-lg bg-success/10">
                                <Activity size={24} className="text-success" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Real-time Panel</h3>
                                <p className="text-sm text-default-600">
                                    Displays Current dB, Peak dB, Average dB, Min dB, and Max dB with color-coded chips.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50">
                        <CardBody className="flex flex-row items-start gap-4">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Database size={24} className="text-warning" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Local Storage</h3>
                                <p className="text-sm text-default-600">
                                    All analysis records are saved and persist across browser sessions automatically.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50">
                        <CardBody className="flex flex-row items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <History size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">History Table</h3>
                                <p className="text-sm text-default-600">
                                    Shows all previous analyses with date, duration, and all dB values for comparison.
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50">
                        <CardBody className="flex flex-row items-start gap-4">
                            <div className="p-2 rounded-lg bg-danger/10">
                                <Trash2 size={24} className="text-danger" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Delete Functionality</h3>
                                <p className="text-sm text-default-600">
                                    Delete individual records or clear all history with ease.
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                    {/* dB Color Coding */}
                    <h3 className="text-2xl font-bold mb-4 mt-6 flex items-center gap-2">
                        <Gauge size={24} className="text-primary" />
                        dB Color Coding
                    </h3>
                <Card className="bg-default-50">
                    <CardBody>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-danger/10 border border-danger/20">
                                <Volume2 size={24} className="text-danger" />
                                <div>
                                    <Chip color="danger" size="sm" className="mb-1">
                                        {">= -10 dB"}
                                    </Chip>
                                    <p className="text-sm text-default-600">Very Loud</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                                <Volume2 size={24} className="text-warning" />
                                <div>
                                    <Chip color="warning" size="sm" className="mb-1">
                                        {">= -30 dB"}
                                    </Chip>
                                    <p className="text-sm text-default-600">Loud</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                                <Volume2 size={24} className="text-success" />
                                <div>
                                    <Chip color="success" size="sm" className="mb-1">
                                        {">= -50 dB"}
                                    </Chip>
                                    <p className="text-sm text-default-600">Moderate</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-default-100 border border-default-200">
                                <VolumeX size={24} className="text-default-500" />
                                <div>
                                    <Chip color="default" size="sm" className="mb-1">
                                        {"< -50 dB"}
                                    </Chip>
                                    <p className="text-sm text-default-600">Quiet</p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                    {/* Advanced Metrics */}
                    <h3 className="text-2xl font-bold mb-4 mt-6 flex items-center gap-2">
                        <BarChart3 size={24} className="text-secondary" />
                        Advanced Metrics
                    </h3>
                    <p className="text-default-600 mb-4">
                        Access advanced metrics by clicking the Activity icon in the Analysis History table.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Loudness Analysis */}
                    <Card className="bg-default-50">
                        <CardHeader className="pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Activity size={20} className="text-primary" />
                                Loudness Analysis
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
                            <ul className="space-y-3">
                                <li>
                                    <span className="font-medium">Crest Factor</span>
                                    <p className="text-sm text-default-600">
                                        Peak-to-average ratio in dB, indicates how "punchy" the audio is.
                                    </p>
                                </li>
                                <li>
                                    <span className="font-medium">Dynamic Range</span>
                                    <p className="text-sm text-default-600">
                                        Difference between maximum and minimum dB levels.
                                    </p>
                                </li>
                                <li>
                                    <span className="font-medium">Loudness Classification</span>
                                    <p className="text-sm text-default-600">
                                        Automatic categorization: Very Loud, Loud, Moderate, Quiet, Very Quiet.
                                    </p>
                                </li>
                            </ul>
                        </CardBody>
                    </Card>

                    {/* Spectral Analysis */}
                    <Card className="bg-default-50">
                        <CardHeader className="pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Waves size={20} className="text-secondary" />
                                Spectral Analysis
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
                            <ul className="space-y-3">
                                <li>
                                    <span className="font-medium">Spectral Centroid</span>
                                    <p className="text-sm text-default-600">
                                        Center of mass of the spectrum, indicates perceived brightness.
                                    </p>
                                </li>
                                <li>
                                    <span className="font-medium">Spectral Rolloff (85%)</span>
                                    <p className="text-sm text-default-600">
                                        Frequency below which 85% of the spectral energy exists.
                                    </p>
                                </li>
                                <li>
                                    <span className="font-medium">Spectral Flatness</span>
                                    <p className="text-sm text-default-600">
                                        Ratio from 0% (tonal) to 100% (noise-like).
                                    </p>
                                </li>
                            </ul>
                        </CardBody>
                    </Card>

                    {/* Frequency Bands */}
                    <Card className="bg-default-50 lg:col-span-2">
                        <CardHeader className="pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Target size={20} className="text-warning" />
                                Frequency Band Distribution
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-danger/10 border border-danger/20">
                                    <h4 className="font-medium text-danger mb-1">Low (20-250 Hz)</h4>
                                    <p className="text-sm text-default-600">
                                        Bass frequencies: kick drums, bass instruments.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                    <h4 className="font-medium text-success mb-1">Mid (250-4000 Hz)</h4>
                                    <p className="text-sm text-default-600">
                                        Vocal range, most instruments, speech clarity.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <h4 className="font-medium text-primary mb-1">High (4000-20000 Hz)</h4>
                                    <p className="text-sm text-default-600">
                                        Presence, air, cymbal shimmer, sibilance.
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                </AccordionItem>

                {/* Space Acoustics Features */}
                <AccordionItem
                    key="acoustics"
                    aria-label="Space Acoustics Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Waves size={24} className="text-secondary" />
                            Space Acoustics Features
                        </span>
                    }
                >
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
                                        Flat, vault, rectangular, pyramidal, curved, and coffered with volume
                                        adjustments.
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
                                    <p className="text-sm text-default-600">
                                        Average distance between reflections (4V/S).
                                    </p>
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
                </AccordionItem>

                {/* Materials Features */}
                <AccordionItem
                    key="materials"
                    aria-label="Materials Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <FileText size={24} className="text-primary" />
                            Materials Features
                        </span>
                    }
                >
                    <p className="text-default-600 mb-4">
                        Generate comprehensive material lists for building audio studios, home studios, rehearsal rooms,
                        and professional acoustic spaces. Choose from 12 build types and 59 specialized materials across
                        8 categories.
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
                                        Acoustic Foam, Fabric-Wrapped Panels, Wooden Slats, Perforated Wood, Acoustic
                                        Fabric
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
                                        Concrete Blocks, Staggered/Double Stud Walls, Plywood, MDF, Rockwool,
                                        Fiberglass, MLV, Green Glue, Resilient Channels, Drywall
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
                                Absorption coefficients vary by frequency (125Hz - 4kHz). Higher values indicate more
                                sound absorption.
                            </p>
                        </CardBody>
                    </Card>
                </div>
                </AccordionItem>

                {/* Instruments Features */}
                <AccordionItem
                    key="instruments"
                    aria-label="Instruments Features"
                    title={
                        <span className="flex items-center gap-2 text-xl font-bold">
                            <Music size={24} className="text-success" />
                            Instruments Features
                        </span>
                    }
                >
                <p className="text-default-600 mb-4">
                    Generate comprehensive instrument lists for musical ensembles, bands, and orchestras. Select your
                    ensemble type, genre, and choose from a wide variety of instruments across 8 categories.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ensemble Types */}
                    <Card className="bg-default-50">
                        <CardHeader className="pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Music size={20} className="text-success" />
                                12 Ensemble Types
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Symphony Orchestra",
                                    "Big Band",
                                    "Jazz Quartet",
                                    "String Quartet",
                                    "Rock Band",
                                    "Choir",
                                    "Chamber Orchestra",
                                    "Wind Ensemble",
                                    "Brass Band",
                                    "Marching Band",
                                    "Pop/Electronic",
                                    "World Music Ensemble",
                                ].map((type) => (
                                    <div
                                        key={type}
                                        className="p-2 rounded-lg bg-success/5 border border-success/10 text-sm"
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Musical Genres */}
                    <Card className="bg-default-50">
                        <CardHeader className="pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Waves size={20} className="text-secondary" />
                                14 Musical Genres
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Classical",
                                    "Jazz",
                                    "Rock",
                                    "Pop",
                                    "Blues",
                                    "Country",
                                    "Electronic",
                                    "Folk",
                                    "R&B/Soul",
                                    "Metal",
                                    "Reggae",
                                    "Latin",
                                    "Hip Hop",
                                    "World Music",
                                ].map((genre) => (
                                    <div
                                        key={genre}
                                        className="p-2 rounded-lg bg-secondary/5 border border-secondary/10 text-sm"
                                    >
                                        {genre}
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Instrument Categories */}
                    <Card className="bg-default-50 lg:col-span-2">
                        <CardHeader className="pb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Layers size={20} className="text-primary" />
                                100+ Instruments Across 8 Categories
                            </h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-danger/10 border border-danger/20">
                                    <h4 className="font-medium text-danger mb-2">Rock & Metal (25)</h4>
                                    <p className="text-sm text-default-600">
                                        Electric/Lead/Rhythm Guitars, Bass, Drum Kit components, Amplifiers, Pedals
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <h4 className="font-medium text-primary mb-2">Strings (11)</h4>
                                    <p className="text-sm text-default-600">
                                        Violin, Viola, Cello, Double Bass, Acoustic/Classical Guitar, Harp, Banjo,
                                        Mandolin, Ukulele
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                                    <h4 className="font-medium text-secondary mb-2">Woodwinds (7)</h4>
                                    <p className="text-sm text-default-600">
                                        Flute, Clarinet, Oboe, Bassoon, Saxophone, Recorder, Piccolo
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                    <h4 className="font-medium text-success mb-2">Brass (6)</h4>
                                    <p className="text-sm text-default-600">
                                        Trumpet, Trombone, French Horn, Tuba, Cornet, Euphonium
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                    <h4 className="font-medium text-warning mb-2">Percussion (15)</h4>
                                    <p className="text-sm text-default-600">
                                        Drum Kit, Timpani, Xylophone, Marimba, Vibraphone, Congas, Bongos, Cajon
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-default/10 border border-default/20">
                                    <h4 className="font-medium text-default-700 mb-2">Keyboards (6)</h4>
                                    <p className="text-sm text-default-600">
                                        Piano, Organ, Synthesizer, Electric Piano, Harpsichord, Accordion
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <h4 className="font-medium text-primary mb-2">Electronic (6)</h4>
                                    <p className="text-sm text-default-600">
                                        Drum Machine, Sampler, DJ Mixer, Turntable, Effects Processor, MIDI Controller
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                    <h4 className="font-medium text-warning mb-2">Ethnic (28)</h4>
                                    <p className="text-sm text-default-600">
                                        Sitar, Tabla, Erhu, Koto, Djembe, Kalimba, Didgeridoo, Oud, Bouzouki, Bagpipes
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
                                        Generate new instrument reports or edit existing ones with full form validation.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                    <h4 className="font-medium text-warning mb-2">Persistent Storage</h4>
                                    <p className="text-sm text-default-600">
                                        All reports automatically saved to localStorage for persistence across sessions.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <h4 className="font-medium text-primary mb-2">History & Review</h4>
                                    <p className="text-sm text-default-600">
                                        View complete report history with ensemble type, genre, and selected instruments.
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
