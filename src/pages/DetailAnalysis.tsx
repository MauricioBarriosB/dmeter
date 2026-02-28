import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import type { AnalysisRecord } from "../components/AnalysisHistoryTable";
import { loadAnalysisHistory } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import LicenseInvalid from "../components/LicenseInvalid";

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFrequency = (hz: number) => {
  if (hz >= 1000) {
    return `${(hz / 1000).toFixed(1)} kHz`;
  }
  return `${hz} Hz`;
};

const getDbColor = (db: number) => {
  if (db >= -10) return "danger";
  if (db >= -30) return "warning";
  if (db >= -50) return "success";
  return "default";
};

export default function DetailAnalysis() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    validateLicense().then(setIsValid);
    if (id) {
      const history = loadAnalysisHistory();
      const found = history.find((r) => r.id === id);
      if (found) {
        setRecord(found);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  // Show loading while validating license
  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-lg text-default-500">Loading...</p>
      </div>
    );
  }

  if (!isValid) return <LicenseInvalid />;

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button
          variant="light"
          startContent={<ArrowLeft size={20} />}
          onPress={() => navigate("/meter")}
          className="mb-6"
        >
          Back to Meter
        </Button>
        <Card>
          <CardBody>
            <p className="text-center text-default-500 py-8">
              Analysis not found. It may have been deleted.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-lg text-default-500">Loading analysis...</p>
      </div>
    );
  }

  const maxAmplitude = record.spectrumPeaks?.[0]?.amplitude ?? -100;

  // Sort peaks by frequency for spectrum visualization (low to high)
  const sortedByFrequency = record.spectrumPeaks
    ? [...record.spectrumPeaks].sort((a, b) => a.frequency - b.frequency)
    : [];

  // Calculate frequency range for placeholder labels
  const minFreq = sortedByFrequency.length > 0 ? sortedByFrequency[0].frequency : 0;
  const maxFreq = sortedByFrequency.length > 0 ? sortedByFrequency[sortedByFrequency.length - 1].frequency : 20000;
  const freqStep = (maxFreq - minFreq) / 19 || 1000; // Step between bars

  // Pad to 20 bars (fill missing with estimated frequencies for gray placeholder bars)
  const paddedPeaks: { frequency: number; amplitude: number | null }[] = sortedByFrequency.map(p => ({
    frequency: p.frequency,
    amplitude: p.amplitude,
  }));

  // Fill remaining slots with estimated frequencies
  for (let i = sortedByFrequency.length; i < 20; i++) {
    const estimatedFreq = Math.round(maxFreq + freqStep * (i - sortedByFrequency.length + 1));
    paddedPeaks.push({ frequency: estimatedFreq, amplitude: null });
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="light"
          startContent={<ArrowLeft size={20} />}
          onPress={() => navigate("/meter")}
          className="mb-4"
        >
          Back to Meter
        </Button>
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 size={40} className="text-primary" />
          <h1
            className="text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Analysis Details
          </h1>
        </div>
        <p className="text-lg text-default-600">
          {formatDate(record.date)}
        </p>
      </div>

      {/* Summary Stats */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Summary</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-default-500 mb-1">Duration</p>
              <p className="text-2xl font-semibold">
                {formatDuration(record.duration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-default-500 mb-1">Peak dB</p>
              <Chip color={getDbColor(record.peakDb)} size="lg">
                {record.peakDb} dB
              </Chip>
            </div>
            <div>
              <p className="text-sm text-default-500 mb-1">Average dB</p>
              <Chip color="primary" size="lg">
                {record.avgDb} dB
              </Chip>
            </div>
            <div>
              <p className="text-sm text-default-500 mb-1">Min dB</p>
              <Chip color="success" size="lg">
                {record.minDb} dB
              </Chip>
            </div>
            <div>
              <p className="text-sm text-default-500 mb-1">Max dB</p>
              <Chip color="warning" size="lg">
                {record.maxDb} dB
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Spectrum Analyzer Graphic */}
      {sortedByFrequency.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Spectrum Analyzer Peaks</h2>
          </CardHeader>
          <CardBody>
            <div className="rounded-lg p-4">
              {/* Y-axis labels */}
              <div className="flex">
                <div className="flex flex-col justify-between text-xs text-gray-400 pr-2 h-64">
                  <span>0 dB</span>
                  <span>-25</span>
                  <span>-50</span>
                  <span>-75</span>
                  <span>-100</span>
                </div>

                {/* Bars container */}
                <div className="flex-1 flex items-end h-64 border-l border-b border-gray-700">
                  {paddedPeaks.map((peak, index) => {
                    if (peak.amplitude === null) {
                      // Gray placeholder bar for missing frequency (100% height)
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center h-full justify-end px-1"
                        >
                          <div
                            className="w-1.5 rounded-t-sm"
                            style={{
                              height: '100%',
                              background: 'linear-gradient(to top, #1f2937, #374151, #4B5563)',
                              opacity: 0.3,
                            }}
                          />
                        </div>
                      );
                    }

                    // Normalize height (0-100%)
                    const heightPercent = Math.max(0, ((peak.amplitude + 100) / 100) * 100);
                    // Color based on amplitude (green -> yellow -> red)
                    const hue = 120 - (peak.amplitude + 100) * 1.2;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center h-full justify-end px-1"
                      >
                        {/* Bar */}
                        <div
                          className="w-1.5 rounded-t-sm transition-all duration-300 relative group"
                          style={{
                            height: `${heightPercent}%`,
                            background: `linear-gradient(to top,
                              hsl(${hue}, 80%, 35%),
                              hsl(${hue}, 90%, 50%),
                              hsl(${hue}, 100%, 65%))`,
                            boxShadow: `0 0 10px hsla(${hue}, 80%, 50%, 0.5)`,
                          }}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {formatFrequency(peak.frequency)}<br />
                            {peak.amplitude} dB
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis labels (frequency) */}
              <div className="flex ml-8">
                <div className="flex-1 flex">
                  {paddedPeaks.map((peak, index) => (
                    <div key={index} className="flex-1 flex justify-center">
                      <span
                        className={`transform -rotate-45 origin-center whitespace-nowrap ${peak.amplitude === null ? 'text-gray-600' : 'text-gray-400'}`}
                        style={{ fontSize: '9px' }}
                      >
                        {formatFrequency(peak.frequency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Frequency Peaks Table */}
      {record.spectrumPeaks && record.spectrumPeaks.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              All {record.spectrumPeaks.length} Frequency Peaks (Maximum Spectrum Values)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-default-200">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">Frequency</th>
                    <th className="text-left p-3 font-semibold">Amplitude</th>
                    <th className="text-left p-3 font-semibold">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {record.spectrumPeaks.map((peak, index) => (
                    <tr
                      key={index}
                      className="border-b border-default-100 hover:bg-default-50"
                    >
                      <td className="p-3 text-default-500">{index + 1}</td>
                      <td className="p-3 font-medium">
                        {formatFrequency(peak.frequency)}
                      </td>
                      <td className="p-3">
                        <Chip
                          size="sm"
                          color={getDbColor(peak.amplitude)}
                          variant="flat"
                        >
                          {peak.amplitude} dB
                        </Chip>
                      </td>
                      <td className="p-3">
                        <div className="w-32 h-3 bg-default-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(0, ((peak.amplitude + 100) / (maxAmplitude + 100)) * 100)}%`,
                              background: `hsl(${120 - (peak.amplitude + 100) * 1.2}, 70%, 50%)`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
