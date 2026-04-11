import { useState } from "react";
import { BattleRecord } from "../types/battle";
import { StatBar } from "./Statbar";
import { heroColors } from "../utils/color"
import { formatDifficulty, difficultyColor } from "../utils/gameData"

interface BattleCardProps {
    battle: BattleRecord;
    index: number;
}

function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric"
    });
}

export function BattleCard({ battle, index }: BattleCardProps) {

    const [tab, setTab] = useState<"damage" | "stagger" | "healing">("damage");

    const dataMap = {
        damage: battle.damage,
        stagger: battle.stagger,
        healing: battle.healing
    };

    const current = dataMap[tab];
    const maxVal = Math.max(...Object.values(current), 1);

    const hasEntries = Object.keys(current).length > 0;

    return (
        <article
            className="battle-card"
            style={{ animationDelay: `${index * 60}ms` }}
        >

            <div className="card-header">
                <div className="card-meta-top">
                    <div className="card-meta-left">

                        <span className={`outcome-badge ${battle.battle_won ? "won" : "lost"}`}>
                            {battle.battle_won ? "VICTORY" : "DEFEAT"}
                        </span>

                        {battle.boss && (<span className="boss-name" style={{ color: battle.boss.color }}>
                            {battle.boss.name}
                        </span>)}

                        <span className="difficulty" style={{ color: `${difficultyColor(battle.difficulty)}`}}>
                            {formatDifficulty(battle.difficulty)}
                        </span>

                    </div>

                    <div className="card-meta-right">

                        <span className="recorded-at">
                            {formatDate(battle.recorded_at)}
                        </span>

                        <span className="duration">
                            {formatDuration(battle.battle_duration)}
                        </span>

                    </div>
                </div>

                {battle.modifiers && battle.modifiers.length > 0 && (

                <div className="modifier-row">

                    {battle.modifiers.map(mod => (

                        <div
                            key={mod.id}
                            className="modifier-badge"
                            title={mod.description}
                            style={{
                                borderColor: mod.color
                            }}
                        >

                            <span
                                className="modifier-name"
                                style={{ color: mod.color }}
                            >
                                {mod.name}
                            </span>

                        </div>

                    ))}

                </div>

            )}

            </div>

            <div className="tab-bar">

                {(["damage", "stagger", "healing"] as const).map((t) => (

                    <button
                        key={t}
                        className={`tab-btn ${tab === t ? "active" : ""} tab-${t}`}
                        onClick={() => setTab(t)}
                    >
                        {t}
                    </button>

                ))}

            </div>


            <div className="stat-list">

                {hasEntries ? (

                    Object.entries(current)
                        .sort(([, a], [, b]) => b - a)
                        .map(([cls, val]) => (

                            <StatBar
                                key={cls}
                                label={cls}
                                value={val}
                                perSecond={val / battle.battle_duration}
                                max={maxVal}
                                color={heroColors[cls]}
                            />

                        ))

                ) : (

                    <p className="empty-stat">
                        No {tab} recorded
                    </p>

                )}

            </div>

        </article>
    );
}