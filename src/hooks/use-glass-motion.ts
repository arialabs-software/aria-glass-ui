"use client";
// Client: pointer gesture handlers, refs and Motion values.

import { useRef, type MouseEvent, type PointerEvent } from "react";
import { animate, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useGlassConfig } from "../config/glass-config.js";
import type { GlassMotionConfig } from "../config/types.js";
import { distanceOutside, rubberBand } from "./gesture-geometry.js";

type PointerHandler<T extends HTMLElement> = (event: PointerEvent<T>) => void;

/** Consumer handlers that the gesture handlers call first. */
export interface GlassPointerHandlers<T extends HTMLElement> {
  onPointerDown?: PointerHandler<T>;
  onPointerMove?: PointerHandler<T>;
  onPointerUp?: PointerHandler<T>;
  onPointerCancel?: PointerHandler<T>;
  onClickCapture?: (event: MouseEvent<T>) => void;
}

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  rect: DOMRect;
}

/**
 * iOS-style press for glass primitives. Spread `handlers` and `motionProps`
 * onto a `motion.*` element and add `className` (`.lg-motion` in styles.css).
 * Springs come from the shared config (`useGlassConfig().springs`).
 *
 * - Press: grows with a spring and lights up from the touch point
 *   (`data-pressed` + `--glass-press-x/y`, styled in styles.css).
 * - Drag: the control stays anchored (it never follows the finger); it
 *   stretches along the drag axis with rubber-band resistance and thins across
 *   it. The stretch is asymmetric: the edge facing the drag takes `flex.lead`
 *   of the extra length and the opposite edge the rest, so dragging up pulls
 *   the top out more than the bottom (same on X).
 * - No drag limit: the press holds and keeps deforming all the way to the
 *   viewport edges until the pointer is lifted (as on iOS).
 * - Releasing more than `cancelDistance` outside the control cancels the tap
 *   (UIControl touch-up-outside); the visual press is unaffected.
 *
 * Only `transform` is animated, so the LiquidLens displacement map (built from
 * the layout size) stays valid and the refraction keeps updating live.
 */
export function useGlassMotion<T extends HTMLElement>(
  { pressScale, hoverScale, flex: flexConfig, cancelDistance }: GlassMotionConfig,
  forward: GlassPointerHandlers<T> = {},
) {
  const { springs: glassSprings } = useGlassConfig();
  const reduceMotion = useReducedMotion();
  const flex = reduceMotion ? null : flexConfig;
  const pressedScale = reduceMotion ? 1 : pressScale;

  const press = useMotionValue(1);
  // Signed stretch per axis (negative = toward left/top) and the element size,
  // captured on press, to turn the stretch into px for the asymmetric shift.
  const flexX = useMotionValue(0);
  const flexY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const lead = flex?.lead ?? 0.5;

  const scaleX = useTransform(
    () => press.get() * (1 + Math.abs(flexX.get()) - Math.abs(flexY.get()) / 2),
  );
  const scaleY = useTransform(
    () => press.get() * (1 + Math.abs(flexY.get()) - Math.abs(flexX.get()) / 2),
  );
  // Scaling grows both edges equally; shifting by (lead - 0.5) of the extra
  // length moves that growth toward the leading edge.
  const x = useTransform(() => flexX.get() * width.get() * press.get() * (lead - 0.5));
  const y = useTransform(() => flexY.get() * height.get() * press.get() * (lead - 0.5));

  const gesture = useRef<Gesture | null>(null);
  const cancelClick = useRef(false);

  function setPressed(node: HTMLElement, pressed: boolean) {
    if (pressed) node.dataset.pressed = "";
    else delete node.dataset.pressed;
    animate(press, pressed ? pressedScale : 1, pressed ? glassSprings.press : glassSprings.release);
  }

  function relaxFlex() {
    animate(flexX, 0, glassSprings.release);
    animate(flexY, 0, glassSprings.release);
  }

  function end(node: HTMLElement, cancelled: boolean) {
    gesture.current = null;
    cancelClick.current = cancelled;
    setPressed(node, false);
    relaxFlex();
  }

  const handlers = {
    onPointerDown(event: PointerEvent<T>) {
      forward.onPointerDown?.(event);
      if (event.defaultPrevented || event.button !== 0) return;
      const node = event.currentTarget;
      node.setPointerCapture(event.pointerId);
      const rect = node.getBoundingClientRect();
      width.set(node.offsetWidth);
      height.set(node.offsetHeight);
      // Where the glow starts: under the fingertip, in element-local %.
      node.style.setProperty("--glass-press-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      node.style.setProperty("--glass-press-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      gesture.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        rect,
      };
      cancelClick.current = false;
      setPressed(node, true);
    },

    onPointerMove(event: PointerEvent<T>) {
      forward.onPointerMove?.(event);
      const current = gesture.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (flex) {
        const dx = event.clientX - current.startX;
        const dy = event.clientY - current.startY;
        animate(flexX, rubberBand(dx, current.rect.width, flex.max), glassSprings.follow);
        animate(flexY, rubberBand(dy, current.rect.height, flex.max), glassSprings.follow);
      }
    },

    onPointerUp(event: PointerEvent<T>) {
      forward.onPointerUp?.(event);
      const current = gesture.current;
      if (current?.pointerId !== event.pointerId) return;
      const outside = distanceOutside(event.clientX, event.clientY, current.rect) > cancelDistance;
      end(event.currentTarget, outside);
    },

    onPointerCancel(event: PointerEvent<T>) {
      forward.onPointerCancel?.(event);
      if (gesture.current?.pointerId === event.pointerId) end(event.currentTarget, true);
    },

    onClickCapture(event: MouseEvent<T>) {
      // Keyboard activation (detail 0) is never a cancelled drag.
      if (cancelClick.current && event.detail !== 0) {
        cancelClick.current = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      forward.onClickCapture?.(event);
    },
  };

  return {
    className: "lg-motion",
    handlers,
    motionProps: {
      style: {
        x,
        y,
        scaleX,
        scaleY,
        // Own the drag on touch screens so the page doesn't pan under the press.
        touchAction: flex ? "none" : "manipulation",
      },
      whileHover:
        reduceMotion || hoverScale === 1
          ? undefined
          : { scale: hoverScale, transition: glassSprings.hover },
    },
  };
}
