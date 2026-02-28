import { forwardRef } from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

interface SpectrumAnalyzerProps {
  isAnalyzing: boolean;
  isValid: boolean;
}

const SpectrumAnalyzer = forwardRef<HTMLDivElement, SpectrumAnalyzerProps>(
  ({ isAnalyzing, isValid }, ref) => {
    if (!isValid) return null;

    return (
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Audio Spectrum</h2>
          {isAnalyzing && (
            <Chip color="success" variant="dot" className="ml-4">
              Recording
            </Chip>
          )}
        </CardHeader>
        <CardBody>
          <div
            ref={ref}
            className="w-full rounded-lg overflow-hidden bg-black"
            style={{ minHeight: "300px" }}
          >
            {!isAnalyzing && (
              <div className="flex items-center justify-center h-75 text-default-500">
                Press "Start analisis" to begin
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
);

SpectrumAnalyzer.displayName = "SpectrumAnalyzer";

export default SpectrumAnalyzer;
