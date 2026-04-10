interface StatBarProps {
    label: string;
    value: number;
    perSecond: number;
    max: number;
    color: string;
}

export function StatBar({ label, value, max, color, perSecond }: StatBarProps) {
    const pct = max > 0 ? (value / max) * 100 : 0;

    const displayValue = value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const displayPerSecond = `${perSecond.toFixed(1)}/s`;

    return (
        <div className="stat-bar-row">
            <span className="stat-label" style={{ color: color }}>{label}</span>
            <div className="stat-track">
                <div className="stat-fill" style={{ width: `${pct}%`, background: color }}>
                    <span className="stat-value-inline">
                        {displayValue}
                    </span>
                </div>
            </div>
            <span className="stat-value">{displayPerSecond}</span>
        </div>
    );
}