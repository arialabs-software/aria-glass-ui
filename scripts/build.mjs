/*
 * Build: tsc emits one ESM file per source file (no bundler), so every
 * "use client" directive survives for React Server Components. Then the
 * vendored engine and the single stylesheet are copied into dist/.
 */
import { execFileSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const from = (...parts) => path.join(root, ...parts);

rmSync(from("dist"), { recursive: true, force: true });

execFileSync(process.execPath, [from("node_modules/typescript/bin/tsc"), "-p", from("tsconfig.build.json")], {
  stdio: "inherit",
});

cpSync(from("src/engine/liquid-glass.js"), from("dist/engine/liquid-glass.js"));

// Order matters: material tokens → LiquidLens layers → aria-glass-ui overrides.
const STYLE_FILES = ["liquid-glass-tokens.css", "liquid-glass.css", "glass.css"];
const { version } = JSON.parse(readFileSync(from("package.json"), "utf8"));
const css = STYLE_FILES.map(
  (file) => `/* ---- ${file} ---- */\n${readFileSync(from("src/styles", file), "utf8").trim()}\n`,
).join("\n");
writeFileSync(from("dist/styles.css"), `/*! aria-glass-ui v${version} | MIT | includes LiquidLens (MIT) */\n${css}`);

console.log("aria-glass-ui built → dist/");
