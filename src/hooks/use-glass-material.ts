"use client";
// Client: layout effect + ResizeObserver that drive the browser-only LiquidLens engine.

import { useLayoutEffect, type CSSProperties, type RefObject } from "react";
import { useGlassConfig } from "../config/glass-config.js";
import type { GlassMaterialProps } from "../config/types.js";
import { ensureEngine } from "../engine/engine.js";
import { cx } from "../utils/cx.js";

/**
 * Base primitive: turns the element attached to `ref` into a LiquidLens glass
 * surface. Spread `dataAttributes` onto that element, merge `className` and
 * `style` with your own, and render `<span className="lg-scrim" />` first when
 * `scrim` is true.
 *
 * The caller owns the ref so the returned props stay plain render values
 * (React Compiler `refs` rule).
 */
export function useGlassMaterial(
  ref: RefObject<HTMLElement | null>,
  {
    variant = "regular",
    tint,
    radius,
    refraction,
    bezel,
    blur,
    interactive = false,
  }: GlassMaterialProps,
) {
  const { engine: engineOptions } = useGlassConfig();
  const isClear = variant === "clear";

  // The displacement map depends on the element's size, radius and overrides,
  // so re-apply on mount, on resize, and whenever those props change.
  useLayoutEffect(() => {
    const node = ref.current;
    const engine = ensureEngine(engineOptions);
    if (!node || !engine) return;

    engine.apply(node);
    const ro = new ResizeObserver(() => engine.apply(node));
    ro.observe(node);
    return () => ro.disconnect();
  }, [ref, engineOptions, variant, radius, refraction, bezel, blur]);

  return {
    scrim: isClear,
    className: cx(
      "lg-glass",
      isClear && "lg-clear",
      tint && `lg-tint-${tint}`,
      interactive && "lg-interactive lg-press",
    ),
    style: (radius != null ? { "--lg-radius": `${radius}px` } : {}) as CSSProperties,
    dataAttributes: {
      // The engine scans for and observes elements with `data-glass`.
      "data-glass": "",
      "data-glass-variant": isClear ? "clear" : undefined,
      "data-lg-refraction": refraction,
      "data-lg-bezel": bezel,
      "data-lg-blur": blur,
    },
  };
}
