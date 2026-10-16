import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/*
 * Library guardrails. React Compiler-compatible hooks are a hard requirement:
 * consumers (e.g. Next.js apps with `reactCompiler: true`) compile our hooks.
 */

const libraryPlugin = {
  rules: {
    // `"use client"` must be justified right below with `// Client: <reason>`.
    "use-client-justification": {
      meta: {
        type: "suggestion",
        schema: [],
        messages: {
          missing:
            'Justify "use client" with a `// Client: <reason>` comment on the next line.',
        },
      },
      create(context) {
        return {
          Program(program) {
            const directive = program.body.find(
              (node) => node.type === "ExpressionStatement" && node.directive === "use client",
            );
            if (!directive) return;
            const [comment] = context.sourceCode.getCommentsAfter(directive);
            const justified =
              comment?.type === "Line" &&
              comment.loc.start.line === directive.loc.end.line + 1 &&
              /^\s*Client:\s*\S/.test(comment.value);
            if (!justified) context.report({ node: directive, messageId: "missing" });
          },
        };
      },
    },
  },
};

export default defineConfig([
  globalIgnores(["dist/**", "src/engine/liquid-glass.js"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { library: libraryPlugin },
    rules: {
      "library/use-client-justification": "error",
      "no-restricted-syntax": [
        "error",
        { selector: "ExportDefaultDeclaration", message: "Use named exports." },
      ],
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "framer-motion", message: 'Import Motion from "motion/react".' }] },
      ],
    },
  },
]);
