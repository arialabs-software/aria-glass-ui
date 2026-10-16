/** UIScrollView's rubber-band constant: resistance grows with distance. */
const RUBBER_BAND = 0.55;

/** Asymptotic rubber band: approaches ±`max` but never reaches it. Keeps the offset's sign. */
export function rubberBand(offset: number, dimension: number, max: number): number {
  return Math.sign(offset) * max * (1 - 1 / ((Math.abs(offset) * RUBBER_BAND) / dimension + 1));
}

type Rect = Pick<DOMRectReadOnly, "left" | "top" | "right" | "bottom">;

/** Distance (px) from a point to a rect; 0 when inside. */
export function distanceOutside(x: number, y: number, rect: Rect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}
