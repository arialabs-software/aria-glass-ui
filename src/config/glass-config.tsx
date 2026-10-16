"use client";
// Client: React context and an effect that pushes engine options to the browser engine.

import { createContext, use, useEffect, type ReactNode } from "react";
import { ensureEngine } from "../engine/engine.js";
import { defaultGlassConfig } from "./default-config.js";
import type { GlassConfig } from "./types.js";

const GlassConfigContext = createContext<GlassConfig>(defaultGlassConfig);

export interface GlassConfigProviderProps {
  /** Build it with `createGlassConfig(overrides)`. */
  config: GlassConfig;
  children: ReactNode;
}

/**
 * Shares one config with every primitive below it. Optional: without it,
 * primitives use `defaultGlassConfig`. Wrap your root layout once.
 */
export function GlassConfigProvider({ config, children }: GlassConfigProviderProps) {
  useEffect(() => {
    const engine = ensureEngine(config.engine);
    if (engine && Object.keys(config.engine).length > 0) engine.set(config.engine);
  }, [config.engine]);

  return <GlassConfigContext value={config}>{children}</GlassConfigContext>;
}

/** The config in effect for this subtree. Use it to build custom primitives. */
export function useGlassConfig(): GlassConfig {
  return use(GlassConfigContext);
}
