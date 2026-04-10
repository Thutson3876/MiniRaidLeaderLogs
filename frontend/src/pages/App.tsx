import { useEffect, useState, useCallback } from "react";
import { BattleRecord } from "../types/battle";
import { fetchBattles } from "../api";
import { BattleCard } from "../components/BattleCard";
import { BattleFilters, FilterState, EMPTY_FILTERS } from "../components/BattleFilters";

export function App() {
    const [battles, setBattles] = useState<BattleRecord[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

    const load = useCallback(async (activeFilters: FilterState) => {
        try {
            setError(null);
            const data = await fetchBattles(activeFilters);
            setBattles(data);
        } catch {
            setError("Could not reach the server.");
        } finally {
            setLoading(false);
        }
    }, []);

    const loadTotal = useCallback(async () => {
        try {
            const data = await fetchBattles(EMPTY_FILTERS);
            setTotalCount(data.length);
        } 
        catch { 

        }
    }, []);

    useEffect(() => { loadTotal(); }, [loadTotal]);

    useEffect(() => {
        setLoading(true);
        load(filters);
        const id = setInterval(() => load(filters), 15000);
        return () => clearInterval(id);
    }, [filters, load]);

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
                    {totalCount > 0 && (
                        <div className="summary-stats">
                            <div className="summary-item">
                                <span className="summary-num">{totalCount}</span>
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
                    <BattleFilters
                        filters={filters}
                        onChange={setFilters}
                        resultCount={battles.length}
                        totalCount={totalCount}
                    />
                    <button
                        className="refresh-btn"
                        onClick={() => { load(filters); loadTotal(); }}
                    >
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
                        <button className="refresh-btn" onClick={() => load(filters)}>Retry</button>
                    </div>
                )}

                {!loading && !error && battles.length === 0 && (
                    <div className="state-block">
                        <p className="empty-text">No battles match your filters.</p>
                        <p className="empty-sub">
                            Try broadening your search or{" "}
                            <button className="link-btn" onClick={() => setFilters(EMPTY_FILTERS)}>
                                reset all filters
                            </button>.
                        </p>
                    </div>
                )}

                {!loading && !error && battles.length > 0 && (
                    <div className="battle-grid">
                        {battles.map((b, i) => (
                            <BattleCard key={b.id} battle={b} index={i} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}