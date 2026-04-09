export interface MeterPayload {
    meterToken: string;
    battleWon: boolean;
    difficulty: number;
    modifierIDs: Array<number>;
    battleDuration: number;
    damage: Record<string, number>;
    stagger: Record<string, number>;
    healing: Record<string, number>;
}

export interface BattleRecord {
    id: number;
    battle_won: boolean;
    difficulty: number;
    modifiers: Modifier[];
    battle_duration: number;
    recorded_at: string;
    damage: Record<string, number>;
    stagger: Record<string, number>;
    healing: Record<string, number>;
}

export interface Modifier {
  id: number;
  name: string;
  description: string;
  color: string;
  sprite: string;
}