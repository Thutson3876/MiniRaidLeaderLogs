import { useState, useRef, useEffect, useCallback } from "react";
import { characters as allCharacters, modifiers as allModifiers, bosses as allBosses } from "../utils/gameData";

export interface FilterState {
    outcome?: "won" | "lost";
    diffMin?: number;
    diffMax?: number;
    recordedAfter?: string;
    recordedBefore?: string;
    characters: string[];
    modifiers: number[];
    bossId?: number;
}
 
export const EMPTY_FILTERS: FilterState = {
    outcome: undefined,
    diffMin: undefined,
    diffMax: undefined,
    recordedAfter: undefined,
    recordedBefore: undefined,
    characters: [],
    modifiers: [],
    bossId: undefined,
};

function filtersEqual(a: FilterState, b: FilterState): boolean {
    return (
        a.outcome === b.outcome &&
        a.diffMin === b.diffMin &&
        a.diffMax === b.diffMax &&
        a.recordedAfter === b.recordedAfter &&
        a.recordedBefore === b.recordedBefore &&
        a.bossId === b.bossId &&
        a.characters.length === b.characters.length &&
        a.characters.every((c, i) => b.characters[i] === c) &&
        a.modifiers.length === b.modifiers.length &&
        a.modifiers.every((m, i) => b.modifiers[i] === m)
    );
}
 
interface BattleFiltersProps {
    filters: FilterState;
    onChange: (f: FilterState) => void;
    resultCount: number;
    totalCount: number;
}

function activeCount(f: FilterState): number {
    let n = 0;
    if (f.outcome) 
        n++;
    if (f.diffMin !== undefined || f.diffMax !== undefined) 
        n++;
    if (f.recordedAfter || f.recordedBefore) 
        n++;
    if (f.characters.length) 
        n++;
    if (f.modifiers.length) 
        n++;
    if (f.bossId !== undefined) 
        n++;
    return n;
}

interface MultiSelectProps {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (vals: string[]) => void;
}
 
function MultiSelect({ label, placeholder, options, selected, onChange }: MultiSelectProps) {
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
                            <label key={opt.value} className="bf-option">
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

interface SingleSelectProps {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    value: string | undefined;
    onChange: (val: string | undefined) => void;
}
 
function SingleSelect({ label, placeholder, options, value, onChange }: SingleSelectProps) {
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
 
function RangeField({
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

export function BattleFilters({ filters, onChange, resultCount, totalCount }: BattleFiltersProps) {
    const options = {
        characters: allCharacters,
        modifiers: allModifiers,
        bosses: allBosses,
    };
    const [expanded, setExpanded] = useState(false);

    const [draft, setDraft] = useState<FilterState>(filters);

    useEffect(() => {
        setDraft(filters);
    }, [filters]);

    const isDirty = !filtersEqual(draft, filters);
    const active = activeCount(filters);
    const isFiltered = resultCount !== totalCount;

    const setDraftField = useCallback(
        <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
            setDraft((prev) => ({ ...prev, [key]: val })),
        []
    );

    const handleApply = () => {
        onChange(draft);
    };

    const handleResetAll = () => {
        setDraft(EMPTY_FILTERS);
        onChange(EMPTY_FILTERS);
    };

    return (
        <div className={`bf-root ${expanded ? "expanded" : ""}`}>
            {/* Top bar */}
            <div className="bf-bar">
                <button
                    type="button"
                    className={`bf-toggle ${active > 0 ? "has-active" : ""}`}
                    onClick={() => setExpanded((v) => !v)}
                >
                    <span>Filters</span>
                    {active > 0 && <span className="bf-badge">{active}</span>}
                    <span className="bf-chevron-sm">{expanded ? "▲" : "▼"}</span>
                </button>
 
                {isFiltered && (
                    <span className="bf-result-count">
                        {resultCount} / {totalCount} battles
                    </span>
                )}
 
                {active > 0 && (
                    <button
                        type="button"
                        className="bf-reset"
                        onClick={handleResetAll}
                    >
                        Reset all
                    </button>
                )}
            </div>
 
            {/* Filter panel */}
            {expanded && (
                <div className="bf-panel">
                    <div className="bf-grid">
                        {/* Outcome */}
                        <SingleSelect
                            label="Outcome"
                            placeholder="Any result"
                            value={draft.outcome}
                            onChange={(v) => setDraftField("outcome", v as "won" | "lost" | undefined)}
                            options={[
                                { value: "won", label: "Victory" },
                                { value: "lost", label: "Defeat" },
                            ]}
                        />
 
                        {/* Boss */}
                        <SingleSelect
                            label="Boss"
                            placeholder="Any boss"
                            value={draft.bossId !== undefined ? String(draft.bossId) : undefined}
                            onChange={(v) => setDraftField("bossId", v !== undefined ? parseInt(v) : undefined)}
                            options={options.bosses.map((b) => ({ value: String(allModifiers.indexOf(b)), label: b }))}
                        />
 
                        {/* Characters */}
                        <MultiSelect
                            label="Characters"
                            placeholder="Any character"
                            selected={draft.characters}
                            onChange={(v) => setDraftField("characters", v)}
                            options={options.characters.map((c) => ({ value: c, label: c }))}
                        />
 
                        {/* Modifiers */}
                        <MultiSelect
                            label="Modifiers"
                            placeholder="Any modifier"
                            selected={draft.modifiers.map(String)}
                            onChange={(v) => setDraftField("modifiers", v.map(Number))}
                            options={options.modifiers.map((m) => ({ value: String(allModifiers.indexOf(m)), label: m }))}
                        />
 
                        {/* Difficulty range */}
                        <RangeField
                            label="Difficulty"
                            minVal={draft.diffMin}
                            maxVal={draft.diffMax}
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            onMinChange={(v) => setDraftField("diffMin", v)}
                            onMaxChange={(v) => setDraftField("diffMax", v)}
                        />
 
                        {/* Date range */}
                        <RangeField
                            label="Recorded Date"
                            type="date"
                            minVal={draft.recordedAfter as unknown as number | undefined}
                            maxVal={draft.recordedBefore as unknown as number | undefined}
                            minPlaceholder="From"
                            maxPlaceholder="Until"
                            onMinChange={(v) => setDraftField("recordedAfter", v as unknown as string | undefined)}
                            onMaxChange={(v) => setDraftField("recordedBefore", v as unknown as string | undefined)}
                        />
                    </div>

                    {/* Apply button */}
                    <div className="bf-actions">
                        <button
                            type="button"
                            className={`bf-apply ${isDirty ? "dirty" : ""}`}
                            onClick={handleApply}
                            disabled={!isDirty}
                        >
                            {isDirty ? "Apply filters" : "Applied"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function battleCharacters(battle: {
    damage: Record<string, number>;
    stagger: Record<string, number>;
    healing: Record<string, number>;
}): string[] {
    return [
        ...new Set([
            ...Object.keys(battle.damage),
            ...Object.keys(battle.stagger),
            ...Object.keys(battle.healing),
        ]),
    ].sort();
}