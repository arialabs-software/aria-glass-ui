import { describe, expect, it } from "vitest";
import { distanceOutside, rubberBand } from "./gesture-geometry.js";

describe("rubberBand", () => {
  const dimension = 55;
  const max = 0.2;

  it("is 0 without offset", () => {
    expect(rubberBand(0, dimension, max)).toBe(0);
  });

  it("reaches half of max when offset × 0.55 equals the dimension", () => {
    expect(rubberBand(100, dimension, max)).toBeCloseTo(max / 2);
  });

  it("keeps the offset's sign with the same magnitude", () => {
    expect(rubberBand(-40, dimension, max)).toBeCloseTo(-rubberBand(40, dimension, max));
  });

  it("grows with the offset but resists more the further it goes", () => {
    const at10 = rubberBand(10, dimension, max);
    const at20 = rubberBand(20, dimension, max);
    const at30 = rubberBand(30, dimension, max);
    expect(at10).toBeLessThan(at20);
    expect(at20).toBeLessThan(at30);
    expect(at30 - at20).toBeLessThan(at20 - at10);
  });

  it("approaches max without reaching it", () => {
    const far = rubberBand(1_000_000, dimension, max);
    expect(far).toBeLessThan(max);
    expect(far).toBeCloseTo(max, 4);
  });
});

describe("distanceOutside", () => {
  const rect = { left: 0, top: 0, right: 100, bottom: 50 };

  it("is 0 inside the rect and on its edges", () => {
    expect(distanceOutside(50, 25, rect)).toBe(0);
    expect(distanceOutside(100, 50, rect)).toBe(0);
  });

  it("measures the distance along one axis beside an edge", () => {
    expect(distanceOutside(-30, 25, rect)).toBe(30);
    expect(distanceOutside(170, 25, rect)).toBe(70);
    expect(distanceOutside(50, -12, rect)).toBe(12);
    expect(distanceOutside(50, 80, rect)).toBe(30);
  });

  it("measures the straight distance to the nearest corner", () => {
    expect(distanceOutside(103, 54, rect)).toBe(5);
  });
});
