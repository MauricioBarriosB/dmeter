import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

interface RealTimeData {
  currentDb: number;
  peakDb: number;
  avgDb: number;
  minDb: number;
  maxDb: number;
}

interface RealTimeValuesPanelProps {
  data: RealTimeData;
  isValid: boolean;
}

const getDbColor = (db: number) => {
  if (db >= -10) return "danger";
  if (db >= -30) return "warning";
  if (db >= -50) return "success";
  return "default";
};

export default function RealTimeValuesPanel({ data, isValid }: RealTimeValuesPanelProps) {
  if (!isValid) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-xl font-semibold">Real-time Analysis</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-default-100 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Current</p>
            <div className="text-3xl font-bold">
              <Chip color={getDbColor(data.currentDb)} size="lg">
                {data.currentDb} dB
              </Chip>
            </div>
          </div>
          <div className="text-center p-4 bg-default-100 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Peak</p>
            <div className="text-3xl font-bold">
              <Chip color="danger" size="lg">
                {data.peakDb} dB
              </Chip>
            </div>
          </div>
          <div className="text-center p-4 bg-default-100 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Average</p>
            <div className="text-3xl font-bold">
              <Chip color="primary" size="lg">
                {data.avgDb} dB
              </Chip>
            </div>
          </div>
          <div className="text-center p-4 bg-default-100 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Min</p>
            <div className="text-3xl font-bold">
              <Chip color="success" size="lg">
                {data.minDb} dB
              </Chip>
            </div>
          </div>
          <div className="text-center p-4 bg-default-100 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Max</p>
            <div className="text-3xl font-bold">
              <Chip color="warning" size="lg">
                {data.maxDb} dB
              </Chip>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
