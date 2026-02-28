
import { Play, Square, AudioWaveform} from "lucide-react";
import { Button} from "@heroui/react";


export default function Meter() {

  const handleStartRoute = async () => {

  };

  const handleFinishRoute = async () => {

  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <AudioWaveform size={40} className="text-primary" />
          <h1
            className="text-5xl font-bold text-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Meter
          </h1>
        </div>
        <p className="text-lg text-default-600 font-normal">
          Start DB analisis for audio performance.
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          color="success"
          size="lg"
          startContent={<Play size={20} />}
          onPress={handleStartRoute}
          className="font-semibold"
        >
          Start Route
        </Button>
        <Button
          color="danger"
          size="lg"
          startContent={<Square size={20} />}
          onPress={handleFinishRoute}
          className="font-semibold"
        >
          Finish Route
        </Button>
      </div>
    </div>
  );
}
