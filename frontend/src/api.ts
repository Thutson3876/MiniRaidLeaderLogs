import { BattleRecord } from "./types/battle";
import { FilterState } from "./components/BattleFilters";

const BASE = "https://miniraidlogsapi.vercel.app/api";

interface PaginatedBattles {
    data: BattleRecord[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

function buildQuery(filters?: Partial<FilterState>, page = 1, perPage = 20): string {
    const params = new URLSearchParams();
 
    params.set("page", String(page));
    params.set("perPage", String(perPage));
 
    if (filters?.outcome)
        params.set("outcome", filters.outcome);
    if (filters?.diffMin !== undefined)
        params.set("diffMin", String(filters.diffMin));
    if (filters?.diffMax !== undefined)
        params.set("diffMax", String(filters.diffMax));
    if (filters?.recordedAfter)             
        params.set("recordedAfter", filters.recordedAfter);
    if (filters?.recordedBefore)            
        params.set("recordedBefore", filters.recordedBefore);
    if (filters?.characters?.length)        
        params.set("characters", filters.characters.join(","));
    if (filters?.modifiers?.length)         
        params.set("modifiers", filters.modifiers.join(","));
    if (filters?.bossId !== undefined)      
        params.set("bossId", String(filters.bossId));
 
    return params.toString();
}
  
export async function fetchBattles(filters?: Partial<FilterState>, page = 1, perPage = 20): Promise<PaginatedBattles> {
    const qs = buildQuery(filters, page, perPage);
    const res = await fetch(`${BASE}/battles?${qs}`);
    if (!res.ok) throw new Error("Failed to fetch battles");
    return res.json();
}
 
export async function fetchAllBattles(): Promise<BattleRecord[]> {
    const res = await fetch(`${BASE}/battles?perPage=1000`);
    if (!res.ok) throw new Error("Failed to fetch battles");
    return res.json();
}