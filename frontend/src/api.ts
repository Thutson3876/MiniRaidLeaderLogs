import { BattleRecord } from "./types/battle";

const BASE = "https://miniraidlogsapi.vercel.app/api";

export async function fetchBattles(): Promise<BattleRecord[]> {
    const res = await fetch(`${BASE}/battles`);
    if (!res.ok) throw new Error("Failed to fetch battles");
    return res.json();
}