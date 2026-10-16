// Side-effect import: the vendored UMD bundle registers `globalThis.LiquidGlass`.
import "./liquid-glass.js";

/** Global material parameters accepted by the LiquidLens engine. */
export interface LiquidGlassOptions {
  /** feDisplacementMap scale (px), edge bend strength. Default 18. */
  refraction: number;
  /** Width (px) of the refracting edge band. Default 22. */
  bezel: number;
  /** Backdrop blur (px). Keep 0–4 or refraction gets washed out. Default 3. */
  blur: number;
  /** Backdrop `saturate()` multiplier. Default 1.8. */
  saturation: number;
  /** Rim/highlight intensity 0..1.5. Default 0.9. */
  specular: number;
  /** Tint hue 0..360. Default 220. */
  tintHue: number;
  /** Tint alpha 0..0.4. Default 0.10. */
  tintOpacity: number;
  /** Max displacement-map dimension (perf cap). Default 360. */
  quality: number;
  /** If true, specular tracks DeviceOrientation (mobile tilt). Default false. */
  tilt: boolean;
}

/** The subset of the LiquidLens engine API this library relies on. */
export interface LiquidGlassEngine {
  init(options?: Partial<LiquidGlassOptions>): LiquidGlassEngine;
  apply(el: Element, opts?: Partial<LiquidGlassOptions>): void;
  applyAll(): void;
  set(partial: Partial<LiquidGlassOptions>): void;
  refresh(el: Element): void;
  destroy(): void;
  state: LiquidGlassOptions;
}

/** Returns the engine, or `null` during SSR. */
export function getEngine(): LiquidGlassEngine | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { LiquidGlass?: LiquidGlassEngine }).LiquidGlass ?? null;
}

let didInit = false;

/**
 * Runs the engine's `init()` once per document with the given options
 * (pointer listeners, resize/mutation observers, CSS vars). Later calls only
 * return the engine; use `engine.set()` to change options afterwards.
 */
export function ensureEngine(options?: Partial<LiquidGlassOptions>): LiquidGlassEngine | null {
  const engine = getEngine();
  if (engine && !didInit) {
    didInit = true;
    engine.init(options);
  }
  return engine;
}
