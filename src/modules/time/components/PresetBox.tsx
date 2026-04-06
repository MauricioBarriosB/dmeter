export default function PresetBox({ label, value, sub }: Readonly<{ label: string; value: string; sub: string }>) {
    return (
        <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-default-500 mb-1">{label}</p>
            <p className="text-xl font-bold font-mono text-primary">{value}</p>
            <p className="text-xs text-default-400 mt-1">{sub}</p>
        </div>
    );
}
