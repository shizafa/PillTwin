// Vivid/neon card background palette. Each entry pairs a background with a
// foreground dark/light enough to stay readable on it, so any card can pick
// one without a per-card contrast check.
export const CARD_COLORS = [
  { bg: "#39FF14", text: "#0a2e05" }, // Neon green
  { bg: "#0066FF", text: "#ffffff" }, // Electric blue
  { bg: "#FF2E93", text: "#ffffff" }, // Hot pink
  { bg: "#FF6B00", text: "#3d1600" }, // Vivid orange
  { bg: "#FFE600", text: "#332b00" }, // Sunny yellow
  { bg: "#8A2BE2", text: "#ffffff" }, // Electric purple
  { bg: "#00E5FF", text: "#003344" }, // Bright cyan
  { bg: "#FF5E5B", text: "#3d0f0e" }, // Neon coral
  { bg: "#B6FF00", text: "#233300" }, // Lime
  { bg: "#5B21B6", text: "#ffffff" }, // Deep violet
  { bg: "#E60099", text: "#ffffff" }, // Hot magenta
  { bg: "#00C9A7", text: "#00332b" }, // Bright teal
];

// Deterministic per-product pick (stable across re-renders/pagination)
// rather than re-rolling on every render, which would flicker.
export function pickCardColor(id) {
  const n = Math.abs(Number(id)) || 0;
  return CARD_COLORS[n % CARD_COLORS.length];
}
