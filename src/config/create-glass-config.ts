import { mergeDeep, type DeepPartial } from "../utils/merge-deep.js";
import { defaultGlassConfig } from "./default-config.js";
import type { GlassConfig } from "./types.js";

export type GlassConfigOverrides = DeepPartial<GlassConfig>;

/**
 * Builds a full config from the defaults plus your overrides. Safe to call in
 * Server Components: the result is plain, serializable data you pass to
 * `<GlassConfigProvider config={...}>`.
 *
 * Setting a preset's `motion.flex` to `null` turns the deformation off; to turn
 * it on for a preset that has `null`, pass the full `{ max, lead }` object.
 */
export function createGlassConfig(overrides?: GlassConfigOverrides): GlassConfig {
  return mergeDeep<GlassConfig>(defaultGlassConfig, overrides);
}
