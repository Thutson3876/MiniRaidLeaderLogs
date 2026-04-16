import { useEffect, useRef, useState } from "react";

interface SingleSelectProps {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    value: string | undefined;
    onChange: (val: string | undefined) => void;
}
 
export function SingleSelect({ label, placeholder, options, value, onChange }: SingleSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
 
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
 
    const selected = options.find((o) => o.value === value);
 
    return (
        <div className="bf-field" ref={ref}>
            <label className="bf-label">{label}</label>
            <button
                type="button"
                className={`bf-trigger ${open ? "open" : ""} ${value ? "has-value" : ""}`}
                onClick={() => setOpen((v) => !v)}
            >
                <span className="bf-trigger-text">{selected?.label ?? placeholder}</span>
                {value && (
                    <span
                        className="bf-clear-badge"
                        onClick={(e) => { e.stopPropagation(); onChange(undefined); setOpen(false); }}
                        title="Clear"
                    >
                        ✕
                    </span>
                )}
                <span className="bf-chevron">{open ? "▲" : "▼"}</span>
            </button>
            {open && (
                <div className="bf-dropdown">
                    {options.map((opt) => (
                        <label
                            key={opt.value}
                            className={`bf-option single ${value === opt.value ? "selected" : ""}`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                        >
                            <span className="bf-opt-check">{value === opt.value ? "◆" : ""}</span>
                            <span className="bf-opt-label">{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}