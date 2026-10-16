/*
 * aria-glass-ui public API. Anything not exported here is internal and may
 * change without a major version. Import the stylesheet once:
 *   import "aria-glass-ui/styles.css";
 */

// Primitives
export { GlassButton, type GlassButtonProps } from "./primitives/glass-button.js";

// Centralized configuration
export { defaultGlassConfig } from "./config/default-config.js";
export { createGlassConfig, type GlassConfigOverrides } from "./config/create-glass-config.js";
export {
  GlassConfigProvider,
  useGlassConfig,
  type GlassConfigProviderProps,
} from "./config/glass-config.js";
export type {
  GlassConfig,
  GlassFlexConfig,
  GlassMaterialProps,
  GlassMotionConfig,
  GlassPreset,
  GlassPresetName,
  GlassSprings,
  GlassTint,
  GlassVariant,
} from "./config/types.js";

// Building blocks for custom primitives
export { useGlassMaterial } from "./hooks/use-glass-material.js";
export { useGlassMotion, type GlassPointerHandlers } from "./hooks/use-glass-motion.js";
export { getEngine, type LiquidGlassEngine, type LiquidGlassOptions } from "./engine/engine.js";
export { cx } from "./utils/cx.js";
