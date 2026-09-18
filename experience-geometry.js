export const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export function storyBlend(tops, viewportHeight) {
  let blend = 0;
  tops.slice(1).forEach((top, i) => {
    if (top < viewportHeight * .65) blend = i + clamp((viewportHeight * .65 - top) / (viewportHeight * .3));
  });
  return blend;
}
export function constellation(count) {
  return Array.from({length: count}, (_, i) => {
    const angle = i * 2.399963, radius = Math.sqrt((i + 1) / count);
    return {x: .5 + Math.cos(angle) * radius * .43, y: .5 + Math.sin(angle) * radius * .36};
  });
}
