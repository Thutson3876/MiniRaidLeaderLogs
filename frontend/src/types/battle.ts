export interface BattleRecord {
  id: number;
  battle_won: boolean;
  battle_duration: number;
  recorded_at: string;
  damage: Record<string, number>;
  stagger: Record<string, number>;
  healing: Record<string, number>;
}