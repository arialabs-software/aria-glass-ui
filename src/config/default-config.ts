import type { GlassConfig } from "./types.js";

/**
 * Default look and feel, modelled on iOS 26 interactive Liquid Glass:
 * - Apple, WWDC25 "Meet Liquid Glass": the resting state stays visually quiet;
 *   on touch the material "illuminates from within", the glow starts under the
 *   fingertip and spreads through the element; it flexes like a gel.
 * - A control never follows the finger: a drag only deforms it, and the edge
 *   facing the drag stretches more than the opposite one. No drag limit.
 * - Releasing within 70pt of the control still taps; further away it cancels.
 * Scale and flex magnitudes are tuning values (no public source gives Apple's).
 */
export const defaultGlassConfig: GlassConfig = {
  engine: {},
  springs: {
    press: { type: "spring", stiffness: 520, damping: 32, mass: 0.6 },
    release: { type: "spring", stiffness: 380, damping: 18, mass: 0.7 },
    follow: { type: "spring", stiffness: 900, damping: 45, mass: 0.5 },
    hover: { type: "spring", stiffness: 300, damping: 24 },
  },
  presets: {
    control: {
      // A ~42px-tall control is all bezel: the engine default (18) is invisible.
      material: { refraction: 60 },
      motion: {
        pressScale: 1.08,
        hoverScale: 1,
        flex: { max: 0.14, lead: 0.75 },
        cancelDistance: 70,
      },
    },
    surface: {
      material: {},
      motion: {
        pressScale: 1.015,
        hoverScale: 1,
        flex: null,
        cancelDistance: 70,
      },
    },
  },
};
