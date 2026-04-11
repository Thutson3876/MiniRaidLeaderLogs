export const characters: string[] = [
    "Alchemist",
    "Astromancer",
    "Chronomancer",
    "Fae",
    "Guardian",
    "Mirage",
    "Reaper",
    "Samurai",
    "Shaman",
    "Vampire",
];

export const modifiers: string[] = [
    "Brittle",
    "Enhanced Actives",
    "Shared Survival",
];

export const bosses: string[] = [
    "Magma Lord",
    "Terra Lord",
    "Glacial Lord",
    "Thunder Lord"
];

export function formatDifficulty(difficulty: number): string {
    if (difficulty === 0) 
        return "Normal";
    if (difficulty === 1) 
        return "Heroic";
    if (difficulty === 2) 
        return "Mythic";

    return `M+${difficulty - 3}`;
}

export function difficultyColor(difficulty: number): string {
    if (difficulty === 0)
        return "#2cff13";
    
    else if (difficulty === 1)
        return "#FDEE00";
    
    else if (difficulty === 2)
        return "#e74c3c";
    
    else if (difficulty === 3)
        return "#ff0000";
    else
        return mythicPlusDifficultyColor(difficulty);
}

function mythicPlusDifficultyColor(difficulty: number): string {
    const mplus: number = difficulty - 3;

    const colors: string[] = [
        "#8b0000",
        "#9c3eed",
        "#b83dd6",
        "#cc47b9",
        "#db529c",
        "#e75e7f",
        "#f16961",
        "#f9753f",
        "#ff8000",
    ];

    const index = Math.min(Math.floor(mplus / 5), colors.length - 1);

    return colors[Math.max(index, 0)];
}