import type { Transition } from "motion/react";
import type { LiquidGlassOptions } from "../engine/engine.js";

export type GlassVariant = "regular" | "clear";
export type GlassTint = "blue" | "green" | "red" | "purple" | "amber";

/** Material props shared by every glass primitive. */
export interface GlassMaterialProps {
  /** `clear` = thinner glass + scrim. Only over photos/video. Default `regular`. */
  variant?: GlassVariant;
  /** Subtle semantic tint (primary/destructive actions). */
  tint?: GlassTint;
  /** Corner radius in px. Must match the visual radius; the engine builds the map from it. */
  radius?: number;
  /** Per-element edge bend strength (px). Engine default 18. */
  refraction?: number;
  /** Per-element refracting band width (px). Engine default 22. */
  bezel?: number;
  /** Per-element backdrop blur (px). Keep 0–4. Engine default 3. */
  blur?: number;
  /** CSS hover lift + press glow of the core. Leave off when Motion drives the element. */
  interactive?: boolean;
}

/** Springs shared by every animated primitive. */
export interface GlassSprings {
  /** Snappy grow on press. */
  press: Transition;
  /** Softer, slightly bouncy return to rest. */
  release: Transition;
  /** Tracks the finger while deforming; stiff so it feels attached. */
  follow: Transition;
  /** Desktop hover (only when a preset's `hoverScale` ≠ 1). */
  hover: Transition;
}

export interface GlassFlexConfig {
  /** Max extra scale along the drag axis (it thins across by half of it). Tuning value. */
  max: number;
  /**
   * Share (0.5–1) of the extra length that goes to the edge facing the drag;
   * the opposite edge gets the rest. 0.5 = symmetric. Tuning value.
   */
  lead: number;
}

export interface GlassMotionConfig {
  /** Scale while pressed. iOS glass controls grow under the finger (> 1). */
  pressScale: number;
  /** Scale on mouse hover. 1 = none (iOS has no hover). */
  hoverScale: number;
  /** Gel-like deformation toward the finger (anchored, asymmetric); `null` disables it. */
  flex: GlassFlexConfig | null;
  /**
   * Release distance (px) outside the control past which the tap is cancelled
   * (UIControl: 70pt). It never ends the visual press; only lifting does.
   */
  cancelDistance: number;
}

/** Material + motion defaults for one family of primitives. */
export interface GlassPreset {
  material: Pick<GlassMaterialProps, "radius" | "refraction" | "bezel" | "blur">;
  motion: GlassMotionConfig;
}

/**
 * The single, centralized configuration every primitive reads. Primitives pick
 * a preset by name; they never hardcode springs or material numbers.
 */
export interface GlassConfig {
  /** Global LiquidLens options, applied once when the engine starts. */
  engine: Partial<LiquidGlassOptions>;
  springs: GlassSprings;
  presets: {
    /** Small tappable controls: buttons, chips, icon buttons, toggles. */
    control: GlassPreset;
    /** Larger floating surfaces: menus, popovers, toolbars, sheets, bars. */
    surface: GlassPreset;
  };
}

export type GlassPresetName = keyof GlassConfig["presets"];
