import { describe, expect, it } from "vitest";
import { createGlassConfig } from "./create-glass-config.js";
import { defaultGlassConfig } from "./default-config.js";

describe("createGlassConfig", () => {
  it("returns the defaults without overrides", () => {
    expect(createGlassConfig()).toEqual(defaultGlassConfig);
  });

  it("deep-merges a single nested value and keeps its siblings", () => {
    const config = createGlassConfig({ presets: { control: { motion: { pressScale: 1.2 } } } });
    expect(config.presets.control.motion.pressScale).toBe(1.2);
    expect(config.presets.control.motion.flex).toEqual(defaultGlassConfig.presets.control.motion.flex);
    expect(config.presets.control.material.refraction).toBe(60);
    expect(config.presets.surface).toEqual(defaultGlassConfig.presets.surface);
  });

  it("turns a preset's flex off with null", () => {
    const config = createGlassConfig({ presets: { control: { motion: { flex: null } } } });
    expect(config.presets.control.motion.flex).toBeNull();
  });

  it("merges springs and engine options", () => {
    const config = createGlassConfig({
      engine: { blur: 2 },
      springs: { press: { stiffness: 600 } },
    });
    expect(config.engine).toEqual({ blur: 2 });
    expect(config.springs.press).toMatchObject({ type: "spring", stiffness: 600, damping: 32 });
  });

  it("never mutates the defaults", () => {
    const before = structuredClone(defaultGlassConfig);
    createGlassConfig({ presets: { control: { material: { refraction: 5 } } } });
    expect(defaultGlassConfig).toEqual(before);
  });
});
