# aria-glass-ui — reglas del proyecto

Librería npm de primitivas Liquid Glass para React 19. La mantienen agentes de IA: estas reglas aplican a **todo** cambio, incluso de una línea.

## Antes de terminar cualquier tarea

- `npm run check` pasa (tsc + ESLint con reglas de React Compiler + Vitest).
- Si cambiaste algo que llega al consumidor (API, estilos, comportamiento): `npm run build` pasa y agregaste la entrada en `CHANGELOG.md` bajo una sección `## Unreleased`.
- Sin `eslint-disable` nuevos. Si una regla estorba, cámbiala en `eslint.config.js` y aquí en el mismo cambio.

## Estructura

```
src/
  index.ts          API pública. Lo que no se exporta aquí es interno.
  primitives/       una primitiva por archivo (glass-button.tsx, navigation-bar.tsx, …)
  hooks/            bloques reutilizables: use-glass-material, use-glass-motion, geometría del gesto
  config/           GlassConfig: tipos, defaults, createGlassConfig, provider/useGlassConfig
  engine/           motor LiquidLens vendored (no editar liquid-glass.js) + engine.ts tipado
  styles/           CSS: tokens y capas de LiquidLens (vendored) + glass.css (ajustes propios)
  utils/            utilidades puras (cx, mergeDeep)
scripts/build.mjs   tsc archivo por archivo (sin bundler) + copia del motor + styles.css único
```

## Reglas de primitivas

- **Configuración centralizada**: una primitiva nunca escribe números de springs, escalas ni refracción. Lee `useGlassConfig().presets[preset]` y `springs`. Si necesita valores nuevos, agrégalos a `GlassConfig` (`config/types.ts`) y a `defaultGlassConfig`, o crea un preset nuevo.
- Se construyen con `useGlassMaterial(ref, material)` + `useGlassMotion(preset.motion, handlersDelUsuario)` sobre un `motion.<elemento>`. El ref lo crea la primitiva (regla `refs` del React Compiler).
- `interactive: false` en el material cuando Motion controla el elemento (las clases `lg-interactive`/`lg-press` del core pelean con Motion).
- Animar solo `transform`: el mapa de refracción depende del tamaño de layout.
- Extienden las props nativas del elemento (`ComponentPropsWithoutRef<"button">`), aceptan `className`/`style` y encadenan los handlers del usuario antes de los del gesto.
- Accesibles: elemento semántico, `aria-*` de estado, foco visible, teclado (`detail === 0` nunca es un arrastre cancelado).
- Comportamiento de referencia (iOS 26): en reposo, quieto con bordes superior e inferior levemente iluminados; al presionar, crece y se ilumina desde el punto de contacto; al arrastrar, se deforma anclado y asimétrico hacia el arrastre, sin límite; soltar a más de 70px cancela el tap.

## Server Components

- Todo archivo que use hooks de React, Motion o APIs del navegador empieza con `"use client"` y, en la línea siguiente, `// Client: <razón>` (lint). `tsc` conserva la directiva por archivo; no introduzcas un bundler que la pierda.
- `config/default-config.ts`, `create-glass-config.ts`, `types.ts` y `utils/` no llevan `"use client"`: se usan en el servidor.

## Publicar una versión

1. Mueve `## Unreleased` del `CHANGELOG.md` a `## x.y.z`.
2. `npm version patch|minor|major` (en `0.x`, una ruptura de API es `minor`).
3. `npm publish` (corre `check` + `build` por `prepublishOnly`).

## Convenciones

- Archivos `kebab-case`, componentes `PascalCase`, hooks `use-x.ts`, exports con nombre (lint), imports relativos con extensión `.js` (ESM `NodeNext`).
- Pruebas `*.test.ts(x)` junto al archivo. Cada primitiva tiene una prueba de render en servidor (`renderToString`).
- Dependencias: `react`, `react-dom` y `motion` son peerDependencies; no agregues dependencias de runtime sin necesidad. Versión exacta y publicada hace ≥ 14 días.
- Docs en español; código, comentarios e identificadores en inglés.
