export interface Modifier {
  id: number;
  name: string;
  description: string;
  color: string;
  sprite: string;
}

export interface BattleRecord {
  id: number;
  battle_won: boolean;
  battle_duration: number;
  difficulty: number;
  recorded_at: string;

  modifiers: Modifier[];

  damage: Record<string, number>;
  stagger: Record<string, number>;
  healing: Record<string, number>;
}