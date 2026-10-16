import { defineConfig } from "vitest/config";

/* Unit + SSR smoke tests. Each test sits next to the file it covers. */
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    restoreMocks: true,
    unstubGlobals: true,
  },
});
