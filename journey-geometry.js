export const COUNT = 96;
const mix = (a, b, t) => a + (b - a) * t;
const noise = i => { const n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
// Stable identities persist across every scene, so reversing scroll retraces the journey.
export function point(i, stage) {
  const column = i % 16, lane = Math.floor(i / 16), x = .07 + column / 15 * .86;
  if (stage === 0) return {x: .03 + noise(i + 1) * .94, y: .08 + noise(i + 200) * .7};
  if (stage === 1) return {x, y: .16 + lane * .095 + Math.sin(column * .45) * .035};
  if (stage === 2) return {x, y: .4 + (lane - 2.5) * .1 * Math.sin(column / 15 * Math.PI / 2)};
  if (stage === 3) return {x: .08 + column / 15 * .84, y: .14 + lane * .106 + (column % 2) * .035};
  const angle = i / COUNT * Math.PI * 2;
  return {x: .5 + Math.cos(angle) * .07, y: .4 + Math.sin(angle) * .2};
}
export function scene(progress) {
  const p = Math.max(0, Math.min(4, progress));
  const stage = Math.min(3, Math.floor(p));
  const t = p - stage, smooth = t * t * (3 - 2 * t);
  return Array.from({length: COUNT}, (_, i) => {
    const a = point(i, stage), b = point(i, stage + 1);
    return {x: mix(a.x, b.x, smooth), y: mix(a.y, b.y, smooth)};
  });
}
