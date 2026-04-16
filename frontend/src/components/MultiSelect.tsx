import { useEffect, useRef, useState } from "react";

interface MultiSelectProps {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (vals: string[]) => void;
}
 
export function MultiSelect({ label, placeholder, options, selected, onChange }: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
 
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
 
    const toggle = (val: string) => {
        onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
    };
 
    const displayText =
        selected.length === 0
            ? placeholder
            : selected.length === 1
            ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
            : `${selected.length} selected`;
 
    return (
        <div className="bf-field" ref={ref}>
            <label className="bf-label">{label}</label>
            <button
                type="button"
                className={`bf-trigger ${open ? "open" : ""} ${selected.length ? "has-value" : ""}`}
                onClick={() => setOpen((v) => !v)}
            >
                <span className="bf-trigger-text">{displayText}</span>
                {selected.length > 0 && (
                    <span
                        className="bf-clear-badge"
                        onClick={(e) => { e.stopPropagation(); onChange([]); }}
                        title="Clear"
                    >
                        {selected.length} ✕
                    </span>
                )}
                <span className="bf-chevron">{open ? "▲" : "▼"}</span>
            </button>
            {open && (
                <div className="bf-dropdown">
                    {options.length === 0 ? (
                        <div className="bf-empty-opt">No options available</div>
                    ) : (
                        options.map((opt) => (
                            <label key={opt.value} className={`bf-option ${selected.includes(opt.value) ? "selected" : ""}`}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(opt.value)}
                                    onChange={() => toggle(opt.value)}
                                />
                                <span className="bf-opt-check">{selected.includes(opt.value) ? "✓" : ""}</span>
                                <span className="bf-opt-label">{opt.label}</span>
                            </label>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}