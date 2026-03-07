import {
    Home as HomeIcon,
    Mic,
    Activity,
    Database,
    History,
    Trash2,
    Play,
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
} from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
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
                    <li>All analysis sessions are automatically saved for review and comparison.</li>
                </ul>
                <div className="flex justify-center gap-4 mt-6">
                    <Button
                        as={Link}
                        to="/meter"
                        color="primary"
                        size="lg"
                        variant="shadow"
                        className="font-semibold text-lg px-8"
                        startContent={<Mic size={20} />}
                    >
                        Audio Meter
                    </Button>
                    <Button
                        as={Link}
                        to="/acoustics"
                        color="secondary"
                        size="lg"
                        variant="shadow"
                        className="font-semibold text-lg px-8"
                        startContent={<Waves size={20} />}
                    >
                        Space Acoustics
                    </Button>
                </div>
            </div>

            {/* Features Section */}
            <section className="mb-10">
                <h2
                    className="text-3xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <Mic size={24} className="text-warning" />
                    Audio Meter Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </section>

            {/* How to Use Meter Section */}
            <section className="mb-10">
                <h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <Play size={24} className="text-success" />
                    How to Use Meter
                </h2>
                <Card className="bg-default-50">
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold shrink-0 text-sm">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Navigate to Meter</h4>
                                    <p className="text-sm text-default-600">
                                        Go to the Meter page using the navigation menu.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-bold shrink-0 text-sm">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Start Analysis</h4>
                                    <p className="text-sm text-default-600">
                                        Press "Start Analysis" to request microphone permission and begin recording.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">While Recording</h4>
                                    <p className="text-sm text-default-600">
                                        See live spectrum and real-time dB values updating as you capture audio.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-danger text-white font-bold shrink-0 text-sm">
                                    4
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Finish Analysis</h4>
                                    <p className="text-sm text-default-600">
                                        Press "Finish Analysis" to stop recording and save to history.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </section>

            {/* dB Color Coding Section */}
            <section className="mb-10">
                <h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <Gauge size={24} className="text-primary" />
                    dB Color Coding
                </h2>
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
            </section>

            {/* Advanced Metrics Section */}
            <section className="mb-10">
                <h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <BarChart3 size={24} className="text-secondary" />
                    Advanced Metrics
                </h2>
                <p className="text-default-600 mb-6">
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
            </section>

            <Divider className="my-10" />

            {/* Space Acoustics Section */}
            <section className="mb-10">
                <h2
                    className="text-3xl font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <Waves size={24} className="text-secondary" />
                    Space Acoustics Features
                </h2>
                <p className="text-default-600 mb-6">
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

                    {/* How to Use Space Acoustics */}
                    <Card className="bg-default-50 lg:col-span-2">
                        <CardHeader className="pb-2">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Play size={20} className="text-success" />
                                How to Use Space Acoustics
                            </h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className="pt-4">
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
                                            Real-time RT60, speech metrics, room modes, and recommendations update
                                            automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
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
            </section>
        </div>
    );
}
