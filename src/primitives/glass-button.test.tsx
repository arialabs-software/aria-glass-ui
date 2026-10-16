import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createGlassConfig } from "../config/create-glass-config.js";
import { GlassConfigProvider } from "../config/glass-config.js";
import { GlassButton } from "./glass-button.js";

/* Server render (no window): what Next.js does before hydration. */
describe("GlassButton (SSR)", () => {
  it("renders a real button with the glass contract and the control preset", () => {
    const html = renderToString(<GlassButton>Continuar</GlassButton>);
    expect(html).toMatch(/^<button/);
    expect(html).toContain('type="button"');
    expect(html).toContain("lg-glass");
    expect(html).toContain("lg-motion");
    expect(html).toContain('data-glass=""');
    expect(html).toContain('data-lg-refraction="60"');
    expect(html).toContain("<span>Continuar</span>");
  });

  it("lets a prop override the preset", () => {
    const html = renderToString(<GlassButton refraction={30}>Ok</GlassButton>);
    expect(html).toContain('data-lg-refraction="30"');
  });

  it("reads the preset from the provider's config", () => {
    const config = createGlassConfig({ presets: { control: { material: { refraction: 42 } } } });
    const html = renderToString(
      <GlassConfigProvider config={config}>
        <GlassButton>Ok</GlassButton>
      </GlassConfigProvider>,
    );
    expect(html).toContain('data-lg-refraction="42"');
  });

  it("adds the scrim for the clear variant", () => {
    const html = renderToString(<GlassButton variant="clear">Play</GlassButton>);
    expect(html).toContain("lg-clear");
    expect(html).toContain('class="lg-scrim"');
  });
});
