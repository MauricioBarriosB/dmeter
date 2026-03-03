import { useNavigate } from "react-router-dom";
import { Trash2, BarChart3, Activity } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";

export interface FrequencyPeak {
  frequency: number; // Hz
  amplitude: number; // dB
}

export interface AnalysisRecord {
  id: string;
  name: string; // User-defined analysis label
  date: string;
  duration: number;
  peakDb: number;
  avgDb: number;
  minDb: number;
  maxDb: number;
  spectrumPeaks?: FrequencyPeak[]; // Top frequencies with highest amplitudes
}

interface AnalysisHistoryTableProps {
  history: AnalysisRecord[];
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
  isValid: boolean;
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getDbColor = (db: number) => {
  if (db >= -10) return "danger";
  if (db >= -30) return "warning";
  if (db >= -50) return "success";
  return "default";
};

export default function AnalysisHistoryTable({
  history,
  onDeleteRecord,
  onClearHistory,
  isValid,
}: AnalysisHistoryTableProps) {
  const navigate = useNavigate();

  if (!isValid) return null;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis History</h2>
        {history.length > 0 && (
          <Button
            color="danger"
            variant="light"
            size="sm"
            startContent={<Trash2 size={16} />}
            onPress={onClearHistory}
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardBody>
        {history.length === 0 ? (
          <p className="text-center text-default-500 py-8">
            No analysis records yet. Start an analysis to create your first
            record.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-default-200">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                  <th className="text-left p-3 font-semibold">Peak dB</th>
                  <th className="text-left p-3 font-semibold">Avg dB</th>
                  <th className="text-left p-3 font-semibold">Min dB</th>
                  <th className="text-left p-3 font-semibold">Max dB</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-default-100 hover:bg-default-50"
                  >
                    <td className="p-3 font-medium">{record.name}</td>
                    <td className="p-3">{formatDate(record.date)}</td>
                    <td className="p-3">{formatDuration(record.duration)}</td>
                    <td className="p-3">
                      <Chip color={getDbColor(record.peakDb)} size="sm">
                        {record.peakDb} dB
                      </Chip>
                    </td>
                    <td className="p-3">
                      <Chip color="primary" size="sm">
                        {record.avgDb} dB
                      </Chip>
                    </td>
                    <td className="p-3">
                      <Chip color="success" size="sm">
                        {record.minDb} dB
                      </Chip>
                    </td>
                    <td className="p-3">
                      <Chip color="warning" size="sm">
                        {record.maxDb} dB
                      </Chip>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-center">
                        <Button
                          color="secondary"
                          variant="light"
                          size="sm"
                          isIconOnly
                          onPress={() => navigate(`/metrics/${record.id}`)}
                          title="View Metrics"
                        >
                          <Activity size={16} />
                        </Button>

                        <Button
                          color="primary"
                          variant="light"
                          size="sm"
                          isIconOnly
                          onPress={() => navigate(`/analysis/${record.id}`)}
                          title="View Peaks"
                        >
                          <BarChart3 size={16} />
                        </Button>
       
                        <Button
                          color="danger"
                          variant="light"
                          size="sm"
                          isIconOnly
                          onPress={() => onDeleteRecord(record.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
