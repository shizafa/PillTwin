export function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

export function mapRange(v, inMin, inMax, outMin, outMax) {
  const t = clamp01((v - inMin) / (inMax - inMin || 1));
  return outMin + t * (outMax - outMin);
}

// A triangle wave peaked at the center of step `index`'s share of the
// scroll range, falling to `floor` at the edges. `halfWidthFactor` > 0.5
// makes neighboring steps' triangles overlap, which is what gives the
// phone screens a true crossfade instead of both hitting 0 at once.
export function stepOpacity(progress, index, total, floor, halfWidthFactor = 0.5) {
  const center = (index + 0.5) / total;
  const halfWidth = halfWidthFactor / total;
  const dist = Math.abs(progress - center);
  const t = clamp01(dist / halfWidth);
  return 1 - t * (1 - floor);
}

export function activeStepIndex(progress, total) {
  return Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
}

// Progress (0-1) local to one step's own window, for staggering animation
// inside a phone screen without it being time-based.
export function localStepProgress(progress, index, total) {
  return mapRange(progress, index / total, (index + 1) / total, 0, 1);
}
