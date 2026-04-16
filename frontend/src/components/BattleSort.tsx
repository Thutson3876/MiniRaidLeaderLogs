import { useState, useEffect, useCallback } from "react";
import { BattleRecord } from "../types/battle";

export type SortField = "duration" | "recordedDate" | "difficulty";
export type SortDirection = "asc" | "desc";

export interface SortState {
    field: SortField;
    direction: SortDirection;
}

export const DEFAULT_SORT: SortState = {
    field: "recordedDate",
    direction: "desc",
};

const SORT_FIELD_LABELS: Record<SortField, string> = {
    duration: "Battle Duration",
    recordedDate: "Recorded Date",
    difficulty: "Difficulty",
};

const DIRECTION_LABELS: Record<SortDirection, { label: string; icon: string }> = {
    asc: { label: "Ascending", icon: "↑" },
    desc: { label: "Descending", icon: "↓" },
};

function sortsEqual(a: SortState, b: SortState): boolean {
    return a.field === b.field && a.direction === b.direction;
}

interface BattleSortProps {
    sort: SortState;
    onChange: (s: SortState) => void;
}

export function BattleSort({ sort, onChange }: BattleSortProps) {
    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState<SortState>(sort);

    useEffect(() => {
        setDraft(sort);
    }, [sort]);

    const isDirty = !sortsEqual(draft, sort);
    const isCustom = !sortsEqual(sort, DEFAULT_SORT);

    const setDraftField = useCallback(
        <K extends keyof SortState>(key: K, val: SortState[K]) =>
            setDraft((prev) => ({ ...prev, [key]: val })),
        []
    );

    const handleApply = () => {
        onChange(draft);
    };

    const handleReset = () => {
        setDraft(DEFAULT_SORT);
        onChange(DEFAULT_SORT);
    };

    const currentLabel = `${SORT_FIELD_LABELS[sort.field]} ${DIRECTION_LABELS[sort.direction].icon}`;

    return (
        <div className={`bs-root ${expanded ? "expanded" : ""}`}>
            {/* Top bar */}
            <div className="bs-bar">
                <button
                    type="button"
                    className={`bs-toggle ${isCustom ? "has-active" : ""}`}
                    onClick={() => setExpanded((v) => !v)}
                >
                    <span>Sort</span>
                    {isCustom && (
                        <span className="bs-current-label">{currentLabel}</span>
                    )}
                    <span className="bs-chevron-sm">{expanded ? "▲" : "▼"}</span>
                </button>

                {isCustom && (
                    <button
                        type="button"
                        className="bs-reset"
                        onClick={handleReset}
                    >
                        Reset All
                    </button>
                )}
            </div>

            {/* Sort panel */}
            {expanded && (
                <div className="bs-panel">
                    <div className="bs-grid">
                        {/* Sort field */}
                        <div className="bs-field">
                            <label className="bs-label">Sort by</label>
                            <div className="bs-options">
                                {(Object.keys(SORT_FIELD_LABELS) as SortField[]).map((field) => (
                                    <button
                                        key={field}
                                        type="button"
                                        className={`bs-option ${draft.field === field ? "selected" : ""}`}
                                        onClick={() => setDraftField("field", field)}
                                    >
                                        {SORT_FIELD_LABELS[field]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort direction */}
                        <div className="bs-field">
                            <label className="bs-label">Direction</label>
                            <div className="bs-options">
                                {(Object.keys(DIRECTION_LABELS) as SortDirection[]).map((dir) => (
                                    <button
                                        key={dir}
                                        type="button"
                                        className={`bs-option ${draft.direction === dir ? "selected" : ""}`}
                                        onClick={() => setDraftField("direction", dir)}
                                    >
                                        {DIRECTION_LABELS[dir].icon} {DIRECTION_LABELS[dir].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Apply button */}
                    <div className="bs-actions">
                        <button
                            type="button"
                            className={`bs-apply ${isDirty ? "dirty" : ""}`}
                            onClick={handleApply}
                            disabled={!isDirty}
                        >
                            {isDirty ? "Apply sort" : "Applied"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function sortBattles(battles: BattleRecord[], sort: SortState): BattleRecord[] {
    return [...battles].sort((a, b) => {
        let cmp = 0;

        switch (sort.field) {
            case "duration":
                cmp = a.battle_duration - b.battle_duration;
                break;
            case "recordedDate":
                cmp =
                    new Date(a.recorded_at).getTime() -
                    new Date(b.recorded_at).getTime();
                break;
            case "difficulty":
                cmp = a.difficulty - b.difficulty;
                break;
        }

        return sort.direction === "asc" ? cmp : -cmp;
    });
}