interface StatBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
}

export function StatBar({ label, value, max, color }: StatBarProps) {
    const pct = max > 0 ? (value / max) * 100 : 0;

    return (
        <div className="stat-bar-row">
        <span className="stat-label">{label}</span>
        <div className="stat-track">
            <div
            className="stat-fill"
            style={{ width: `${pct}%`, background: color }}
            />
        </div>
        <span className="stat-value">{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
    );
}