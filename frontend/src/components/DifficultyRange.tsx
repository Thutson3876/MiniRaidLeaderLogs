import { SingleSelect } from "./SingleSelect";

const NAMED_DIFFS = [
    { value: 0, label: "Normal" },
    { value: 1, label: "Heroic" },
    { value: 2, label: "Mythic" },
    { value: 3, label: "Mythic+" },
];

function diffToDropdown(n: number | undefined): string {
    if (n === undefined) return "";
    if (n <= 2) return String(n);
    return "3"; // Mythic+
}

function diffToMythicPlusNum(n: number | undefined): number {
    if (n === undefined || n <= 2) return 0;
    return n - 3;
}

interface DifficultySelectProps {
    label: string;
    value: number | undefined;
    onChange: (v: number | undefined) => void;
}

export function DifficultySelect({ label, value, onChange }: DifficultySelectProps) {
    const isMythicPlus = value !== undefined && value > 2;
    const mythicPlusNum = diffToMythicPlusNum(value);
    const dropdownVal = diffToDropdown(value);

    const handleDropdown = (v: string | undefined) => {
        if (!v) { onChange(undefined); return; }
        const parsed = parseInt(v, 10);
        if (parsed < 3) { onChange(parsed); }
        else { onChange(3 + mythicPlusNum); }
    };

    const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseInt(e.target.value, 10);
        if(isNaN(n)) onChange(3);
        if (n >= 0) onChange(3 + n);
    };

    return (
        <div className="bf-field bf-field-difficulty">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <SingleSelect
                label=""
                placeholder={label}
                value={dropdownVal || undefined}
                onChange={handleDropdown}
                options={NAMED_DIFFS.map((d) => ({ value: String(d.value), label: d.label }))}
            />
            <input
                type="number"
                className={`bf-range-input ${isMythicPlus ? "has-value" : ""}`}
                style={{ 
                width: 60, 
                minWidth: 30, 
                opacity: isMythicPlus ? 1 : 0.3 
                }}
                value={isMythicPlus ? mythicPlusNum : ""}
                min={0}
                step={1}
                placeholder="0"
                disabled={!isMythicPlus}
                onChange={handleNumber}
            />
            </div>
        </div>
        </div>
    );
}

interface DifficultyRangeProps {
    minVal: number | undefined;
    maxVal: number | undefined;
    onMinChange: (v: number | undefined) => void;
    onMaxChange: (v: number | undefined) => void;
}

export function DifficultyRange({ minVal, maxVal, onMinChange, onMaxChange }: DifficultyRangeProps) {
    return (
        <div className="bf-field bf-field-difficulty">
            <div>
                <label className="bf-label">Difficulty</label>
                <div className="bf-range-row">
                    <DifficultySelect label="Min" value={minVal} onChange={onMinChange} />
                    <span className="bf-range-sep">—</span>
                    <DifficultySelect label="Max" value={maxVal} onChange={onMaxChange} />
                </div>
            </div>
            
        </div>
    );
}