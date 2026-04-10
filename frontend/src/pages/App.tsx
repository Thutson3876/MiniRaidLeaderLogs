import { useEffect, useState, useCallback } from "react";
import { BattleRecord } from "../types/battle";
import { fetchBattles } from "../api";
import { BattleCard } from "../components/BattleCard";

    export function App() {
    const [battles, setBattles] = useState<BattleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "won" | "lost">("all");

    const load = useCallback(async () => {
    try {
        setError(null);
        const data = await fetchBattles();
        setBattles(data);
    } catch {
        setError("Could not reach the server.");
    } finally {
        setLoading(false);
    }
    }, []);

    useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
    }, [load]);

    const filtered = battles.filter((b) => {
    if (filter === "won") return b.battle_won;
    if (filter === "lost") return !b.battle_won;
    return true;
    });

    const wins = battles.filter((b) => b.battle_won).length;
    const losses = battles.length - wins;

    return (
    <>
        <header className="site-header">
        <div className="header-inner">
            <div className="title-block">
            <h1 className="site-title">MINI RAID LOGS</h1>
            <p className="site-sub">Git gud</p>
            </div>
            {battles.length > 0 && (
            <div className="summary-stats">
                <div className="summary-item">
                <span className="summary-num">{battles.length}</span>
                <span className="summary-label">Battles</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-item won-item">
                <span className="summary-num">{wins}</span>
                <span className="summary-label">Victories</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-item lost-item">
                <span className="summary-num">{losses}</span>
                <span className="summary-label">Defeats</span>
                </div>
            </div>
            )}
        </div>
        </header>

        <main className="main-content">
        <div className="toolbar">
            <div className="filter-group">
            {(["all", "won", "lost"] as const).map((f) => (
                <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
                >
                {f === "all" ? "All" : f === "won" ? "Victories" : "Defeats"}
                </button>
            ))}
            </div>
            <button className="refresh-btn" onClick={load}>
            ↻ Refresh
            </button>
        </div>

        {loading && (
            <div className="state-block">
            <div className="spinner" />
            <p>Rewinding recent damage…</p>
            </div>
        )}

        {error && (
            <div className="state-block error-block">
            <p className="error-text">⚔ {error}</p>
            <button className="refresh-btn" onClick={load}>Retry</button>
            </div>
        )}

        {!loading && !error && filtered.length === 0 && (
            <div className="state-block">
            <p className="empty-text">No battles recorded yet.</p>
            <p className="empty-sub">POST to <code>/api/battles</code> to log your first encounter.</p>
            </div>
        )}

        {!loading && !error && filtered.length > 0 && (
            <div className="battle-grid">
            {filtered.map((b, i) => (
                <BattleCard key={b.id} battle={b} index={i} />
            ))}
            </div>
        )}
        </main>
    </>
    );
}