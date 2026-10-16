"use client";
// Client: browser-only refraction engine and press/flex pointer gesture (Motion).

import { motion } from "motion/react";
import { useRef, type ComponentPropsWithoutRef } from "react";
import { useGlassConfig } from "../config/glass-config.js";
import type { GlassMaterialProps, GlassPresetName } from "../config/types.js";
import { useGlassMaterial } from "../hooks/use-glass-material.js";
import { useGlassMotion } from "../hooks/use-glass-motion.js";
import { cx } from "../utils/cx.js";

export interface GlassButtonProps
  extends Omit<
      ComponentPropsWithoutRef<"button">,
      // Owned by Motion's gesture/animation system.
      "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
    >,
    Omit<GlassMaterialProps, "interactive"> {
  /** Shared material + motion config to use. Default `control`. */
  preset?: GlassPresetName;
}

/**
 * Pressable Liquid Glass button: real edge refraction, iOS-style grow and
 * inner glow on press, gel-like anchored flex while dragging, and tap
 * cancellation when released far away.
 */
export function GlassButton({
  preset = "control",
  variant,
  tint,
  radius,
  refraction,
  bezel,
  blur,
  className,
  style,
  type = "button",
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClickCapture,
  children,
  ...rest
}: GlassButtonProps) {
  const { presets } = useGlassConfig();
  const config = presets[preset];
  const ref = useRef<HTMLButtonElement>(null);
  const glass = useGlassMaterial(ref, {
    variant,
    tint,
    radius: radius ?? config.material.radius,
    refraction: refraction ?? config.material.refraction,
    bezel: bezel ?? config.material.bezel,
    blur: blur ?? config.material.blur,
    // Motion drives transform; the core's CSS hover/press would fight it.
    interactive: false,
  });
  const motionGlass = useGlassMotion(config.motion, {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
  });

  return (
    <motion.button
      {...rest}
      {...glass.dataAttributes}
      {...motionGlass.handlers}
      whileHover={motionGlass.motionProps.whileHover}
      ref={ref}
      type={type}
      className={cx(glass.className, motionGlass.className, "lg-btn", className)}
      style={{ ...glass.style, ...style, ...motionGlass.motionProps.style }}
    >
      {glass.scrim && <span className="lg-scrim" aria-hidden="true" />}
      {/* Wrapped so the label sits above the specular layers (`.lg-glass > *`). */}
      <span>{children}</span>
    </motion.button>
  );
}
