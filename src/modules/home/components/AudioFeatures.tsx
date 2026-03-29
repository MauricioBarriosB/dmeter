import { BarChart3, Upload, Music2, Volume2, Activity, Clock, Disc3, Radio } from "lucide-react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function AudioFeatures() {
    return (
        <>
            <p className="text-default-600 mb-4">
                Professional audio mastering frequency analysis with spectrum visualization, loudness metrics, and
                detailed harmonic analysis. Designed for audio engineers and music producers.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Input */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Upload size={20} className="text-primary" />
                            Audio File Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">Multiple Formats</span>
                                <p className="text-sm text-default-600">
                                    Support for MP3, WAV, OGG, FLAC, and AAC audio files up to 50MB.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Web Audio API</span>
                                <p className="text-sm text-default-600">
                                    High-quality analysis using browser's native audio processing capabilities.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Genre & Media */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Disc3 size={20} className="text-secondary" />
                            Genre & Media Classification
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">20 Music Genres</span>
                                <p className="text-sm text-default-600">
                                    Rock, Pop, Jazz, Classical, Electronic, Hip Hop, Metal, Blues, and more.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">17 Media Types</span>
                                <p className="text-sm text-default-600">
                                    Radio, CD, Vinyl, Streaming, Spotify, YouTube, Apple Music, and more.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Loudness Metrics */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Volume2 size={20} className="text-warning" />
                            Loudness Metrics
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">Peak & RMS Levels</span>
                                <p className="text-sm text-default-600">
                                    Maximum amplitude and average loudness measurements in dB.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">LUFS & Dynamic Range</span>
                                <p className="text-sm text-default-600">
                                    Estimated loudness units and dynamic range for mastering reference.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Frequency Analysis */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Activity size={20} className="text-success" />
                            Spectral Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">FFT Analysis</span>
                                <p className="text-sm text-default-600">
                                    8192-point FFT for detailed frequency spectrum analysis.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Spectral Metrics</span>
                                <p className="text-sm text-default-600">
                                    Centroid, rolloff, flatness, and balance assessment.
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
                    Advanced Analysis
                </h3>

                {/* Octave Band Analysis */}
                <Card className="bg-default-50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Music2 size={20} className="text-primary" />
                            Octave Band Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <p className="text-default-600 mb-4">
                            Magnitude analysis at standard octave band frequencies for professional mixing and mastering
                            reference.
                        </p>
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                            {[31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000].map((freq) => (
                                <div
                                    key={freq}
                                    className="p-2 rounded-lg bg-default-100 border border-default-200 text-center"
                                >
                                    <p className="font-semibold text-xs">{freq >= 1000 ? `${freq / 1000}k` : freq}</p>
                                    <p className="text-xs text-default-500">Hz</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Harmonic Analysis */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Radio size={20} className="text-danger" />
                            Harmonic Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">Fundamental Detection</span>
                                <p className="text-sm text-default-600">
                                    Autocorrelation-based pitch estimation for fundamental frequency.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">THD Estimation</span>
                                <p className="text-sm text-default-600">
                                    Total Harmonic Distortion calculation from harmonic series.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Temporal Analysis */}
                <Card className="bg-default-50">
                    <CardHeader className="pb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock size={20} className="text-warning" />
                            Temporal Analysis
                        </h3>
                    </CardHeader>
                    <Divider />
                    <CardBody className="pt-4">
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium">BPM Estimation</span>
                                <p className="text-sm text-default-600">
                                    Onset detection and tempo analysis for rhythmic content.
                                </p>
                            </li>
                            <li>
                                <span className="font-medium">Zero Crossing Rate</span>
                                <p className="text-sm text-default-600">
                                    Signal characteristic analysis for percussion/tonal classification.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
