interface RangeFieldProps {
    label: string;
    minVal: number | undefined;
    maxVal: number | undefined;
    minPlaceholder?: string;
    maxPlaceholder?: string;
    onMinChange: (v: number | undefined) => void;
    onMaxChange: (v: number | undefined) => void;
    type?: "number" | "date";
}
 
export function RangeField({
    label, minVal, maxVal, minPlaceholder = "Min", maxPlaceholder = "Max",
    onMinChange, onMaxChange, type = "number",
}: RangeFieldProps) {
    const parseVal = (s: string) => {
        if (!s) return undefined;
        if (type === "number") { const n = parseInt(s, 10); return isNaN(n) ? undefined : n; }
        return undefined;
    };
 
    const hasValue = minVal !== undefined || maxVal !== undefined;
 
    return (
        <div className="bf-field">
            <label className="bf-label">
                {label}
                {hasValue && (
                    <span
                        className="bf-label-clear"
                        onClick={() => { onMinChange(undefined); onMaxChange(undefined); }}
                    >✕ clear</span>
                )}
            </label>
            <div className="bf-range-row">
                {type === "date" ? (
                    <>
                        <input
                            type="date"
                            className={`bf-range-input date-input ${minVal !== undefined ? "has-value" : ""}`}
                            value={minVal !== undefined ? String(minVal) : ""}
                            onChange={(e) => onMinChange(e.target.value ? (e.target.value as unknown as number) : undefined)}
                            placeholder={minPlaceholder}
                        />
                        <span className="bf-range-sep">—</span>
                        <input
                            type="date"
                            className={`bf-range-input date-input ${maxVal !== undefined ? "has-value" : ""}`}
                            value={maxVal !== undefined ? String(maxVal) : ""}
                            onChange={(e) => onMaxChange(e.target.value ? (e.target.value as unknown as number) : undefined)}
                            placeholder={maxPlaceholder}
                        />
                    </>
                ) : (
                    <>
                        <input
                            type="number"
                            className={`bf-range-input ${minVal !== undefined ? "has-value" : ""}`}
                            value={minVal ?? ""}
                            step={1}
                            min={0}
                            placeholder={minPlaceholder}
                            onChange={(e) => onMinChange(parseVal(e.target.value))}
                        />
                        <span className="bf-range-sep">—</span>
                        <input
                            type="number"
                            className={`bf-range-input ${maxVal !== undefined ? "has-value" : ""}`}
                            value={maxVal ?? ""}
                            step={1}
                            min={0}
                            placeholder={maxPlaceholder}
                            onChange={(e) => onMaxChange(parseVal(e.target.value))}
                        />
                    </>
                )}
            </div>
        </div>
    );
}