import { useState, useEffect, useCallback } from "react";
import { characters as allCharacters, modifiers as allModifiers, bosses as allBosses } from "../utils/gameData";
import { DifficultyRange } from "./DifficultyRange";
import { MultiSelect } from "./MultiSelect";
import { RangeField } from "./RangeField";
import { SingleSelect } from "./SingleSelect";

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
                            options={options.bosses.map((b) => ({ value: String(allBosses.indexOf(b)), label: b }))}
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
                        <DifficultyRange
                            minVal={draft.diffMin}
                            maxVal={draft.diffMax}
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