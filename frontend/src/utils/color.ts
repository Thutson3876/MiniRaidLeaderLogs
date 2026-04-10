function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map(v => Math.max(0, Math.min(255, Math.round(v))))
      .map(v => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function lighten(hex: string, amount = 0.2) {
  const { r, g, b } = hexToRgb(hex);

  const newR = r + (255 - r) * amount;
  const newG = g + (255 - g) * amount;
  const newB = b + (255 - b) * amount;

  return rgbToHex(newR, newG, newB);
}

export function gradientFromColor(baseColor: string): string {
  const lighter = lighten(baseColor, 0.25);

  return `linear-gradient(90deg, ${baseColor}, ${lighter})`;
}

export const heroColors: Record<string, string> = {
    "Alchemist": gradientFromColor("#AFFF00"),
    "Astromancer": gradientFromColor("#A993FF"),
    "Chronomancer": gradientFromColor("#FFEE00"),
    "Fae": gradientFromColor("#FFCBFA"),
    "Guardian": gradientFromColor("#65FF00"),
    "Mirage": gradientFromColor("#E9C429"),
    "Reaper": gradientFromColor("#AF00DB"),
    "Samurai": gradientFromColor("#FF2D2D"),
    "Shaman": gradientFromColor("#4273FF"),
    "Vampire": gradientFromColor("#8C0000")
};