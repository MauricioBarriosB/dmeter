import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import type { AnalysisRecord } from "../components/AnalysisHistoryTable";
import { loadAnalysisHistory } from "../helpers/analysisStorage";
import { validateLicense } from "../helpers/licenseValidator";
import {
  formatDate,
  formatDuration,
  getDbColor,
  getPaddedSpectrumPeaks,
} from "../helpers/spectrumPeaksHelper";
import LicenseInvalid from "../components/LicenseInvalid";
import FrequencyPeaksTable from "../components/FrequencyPeaksTable";
import SpectrumAnalyzerGraphic from "../components/SpectrumAnalyzerGraphic";

export default function DetailAnalysis() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    validateLicense().then(setIsValid);
    if (id) {
      loadAnalysisHistory().then((history) => {
        const found = history.find((r) => r.id === id);
        if (found) {
          setRecord(found);
        } else {
          setNotFound(true);
        }
      });
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

  const paddedPeaks = getPaddedSpectrumPeaks(record.spectrumPeaks);

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
            Frequency Peaks
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
      {record.spectrumPeaks && record.spectrumPeaks.length > 0 && (
        <SpectrumAnalyzerGraphic paddedPeaks={paddedPeaks} />
      )}

      {/* Frequency Peaks Table */}
      {record.spectrumPeaks && record.spectrumPeaks.length > 0 && (
        <FrequencyPeaksTable spectrumPeaks={record.spectrumPeaks} />
      )}

      
      {/* Navigation */}
      <div className="flex gap-4 justify-center pt-4">
        <Button
          color="default"
          variant="flat"
          startContent={<ArrowLeft size={20} />}
          onPress={() => navigate("/meter")}
        >
          Back to Meter
        </Button>
        <Button
          color="default"
          variant="flat"
          onPress={() => navigate(`/metrics/${record.id}`)}
        >
          View Advanced Metrics
        </Button>
      </div>
    </div>
  );
}
