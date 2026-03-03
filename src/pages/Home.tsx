import {
  Home as HomeIcon,
  Mic,
  Activity,
  Database,
  History,
  Trash2,
  Play,
  Radio,
  Square,
  Gauge,
  Waves,
  BarChart3,
  Volume2,
  VolumeX,
  Zap,
  Target,
  AudioWaveform,
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
        <p className="text-lg text-default-600 font-normal">
          Analyze audio input from your microphone with real-time decibel
          monitoring. Track current, peak, average, and range dB values while
          viewing a live frequency spectrum visualization.
        </p>
        <div className="flex justify-center mt-6">
          <Button
            as={Link}
            to="/meter"
            color="primary"
            size="lg"
            variant="shadow"
            className="font-semibold text-lg px-8"
            startContent={<Mic size={20} />}
          >
            Start Analysis
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="mb-10">
        <h2
          className="text-2xl font-bold mb-6 flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <Zap size={24} className="text-warning" />
          Features
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
                  Captures microphone input with disabled echo cancellation,
                  noise suppression, and auto gain for accurate readings.
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
                  Real-time spectrum display with rainbow gradient, LED bars,
                  and peak detection using audiomotion-analyzer.
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
                  Displays Current dB, Peak dB, Average dB, Min dB, and Max dB
                  with color-coded chips.
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
                  All analysis records are saved and persist across browser
                  sessions automatically.
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
                  Shows all previous analyses with date, duration, and all dB
                  values for comparison.
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

      {/* How to Use Section */}
      <section className="mb-10">
        <h2
          className="text-2xl font-bold mb-6 flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <Play size={24} className="text-success" />
          How to Use
        </h2>
        <Card className="bg-default-50">
          <CardBody>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-1">
                    <AudioWaveform size={18} className="text-secondary" />
                    Navigate to Meter
                  </h3>
                  <p className="text-default-600">
                    Go to the Meter page using the navigation menu to access the
                    audio analysis tool.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success text-white font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-1">
                    <Play size={18} className="text-success" />
                    Start Analysis
                  </h3>
                  <p className="text-default-600">
                    Press "Start Analysis" to request microphone permission and
                    begin recording with visualization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-1">
                    <Radio size={18} className="text-primary" />
                    While Recording
                  </h3>
                  <p className="text-default-600">
                    See live spectrum and real-time dB values updating as you
                    capture audio.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-danger text-white font-bold shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-1">
                    <Square size={18} className="text-danger" />
                    Finish Analysis
                  </h3>
                  <p className="text-default-600">
                    Press "Finish Analysis" to stop recording and save the
                    analysis to history.
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
          Access advanced metrics by clicking the Activity icon in the Analysis
          History table.
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
                    Peak-to-average ratio in dB, indicates how "punchy" the
                    audio is.
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
                    Automatic categorization: Very Loud, Loud, Moderate, Quiet,
                    Very Quiet.
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
                    Center of mass of the spectrum, indicates perceived
                    brightness.
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
                  <h4 className="font-medium text-danger mb-1">
                    Low (20-250 Hz)
                  </h4>
                  <p className="text-sm text-default-600">
                    Bass frequencies: kick drums, bass instruments.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-medium text-success mb-1">
                    Mid (250-4000 Hz)
                  </h4>
                  <p className="text-sm text-default-600">
                    Vocal range, most instruments, speech clarity.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-medium text-primary mb-1">
                    High (4000-20000 Hz)
                  </h4>
                  <p className="text-sm text-default-600">
                    Presence, air, cymbal shimmer, sibilance.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
