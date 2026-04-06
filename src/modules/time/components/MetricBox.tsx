export default function MetricBox({ color, label, value, sub }: Readonly<{ color: string; label: string; value: string; sub: string }>) {
    return (
        <div className={`text-center p-4 rounded-lg bg-${color}/10`}>
            <p className="text-sm text-default-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold text-${color} font-mono`}>{value}</p>
            <p className="text-xs text-default-400">{sub}</p>
        </div>
    );
}
