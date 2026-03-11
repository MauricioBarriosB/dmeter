import { AudioWaveform } from "lucide-react";

export default function LicenseInvalid() {
    return (
        <div className="flex flex-col items-center justify-center min-h-100 text-center">
            <AudioWaveform size={60} className="text-danger mb-4" />
            <h1 className="text-3xl font-bold text-danger mb-2">License Invalid</h1>
            <p className="text-default-500">This application requires a valid license to run.</p>
        </div>
    );
}
