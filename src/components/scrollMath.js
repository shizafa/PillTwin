export function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

export function mapRange(v, inMin, inMax, outMin, outMax) {
  const t = clamp01((v - inMin) / (inMax - inMin || 1));
  return outMin + t * (outMax - outMin);
}
