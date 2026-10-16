# aria-glass-ui

Primitivas de UI **Liquid Glass** para React, con **una sola configuración centralizada** que comparten todas las primitivas.

- Refracción real en los bordes (motor [LiquidLens](https://github.com/DevBehindYou/LiquidLens), SVG `feDisplacementMap` como `backdrop-filter`).
- Gestos estilo iOS 26 con [Motion](https://motion.dev): crece al presionar, se ilumina desde dentro donde tocas, se deforma como gel hacia donde arrastras (anclado, sin seguir al dedo) y cancela el tap si sueltas lejos.
- Listo para React Server Components: cada primitiva es un Client Component (`"use client"` preservado) que puedes usar directamente desde páginas y layouts de servidor.

> Primitivas disponibles: `GlassButton`. Próximas: `NavigationBar`, `SelectMenu`, `Modal`, `PressableMenu`.

## Instalación

```bash
npm install aria-glass-ui motion
```

Dependencias de pares: `react` y `react-dom` ≥ 19, `motion` ^13.5.1.

## Uso

1. Importa la hoja de estilos **una vez**, en el layout raíz:

```tsx
import "aria-glass-ui/styles.css";
```

2. Usa las primitivas:

```tsx
import { GlassButton } from "aria-glass-ui";

<GlassButton onClick={save}>Guardar</GlassButton>
<GlassButton tint="blue">Confirmar</GlassButton>
<GlassButton variant="clear">Play</GlassButton>
```

El vidrio solo se ve sobre contenido con detalle (texto, imágenes, degradados): es para controles que **flotan** sobre la página, no para el contenido en sí.

## Configuración centralizada

Todas las primitivas leen sus valores de un único `GlassConfig`:

- `engine`: opciones globales del motor de refracción (`blur`, `saturation`, `specular`, …).
- `springs`: resortes de Motion (`press`, `release`, `follow`, `hover`).
- `presets`: material + movimiento por familia de primitivas.
  - `control`: controles pequeños (botones, chips).
  - `surface`: superficies grandes (menús, barras, sheets).

Sin hacer nada se usa `defaultGlassConfig`. Para personalizar, envuelve la app una vez:

```tsx
// app/layout.tsx (Server Component)
import "aria-glass-ui/styles.css";
import { GlassConfigProvider, createGlassConfig } from "aria-glass-ui";

const glassConfig = createGlassConfig({
  presets: {
    control: { motion: { pressScale: 1.1, flex: { max: 0.1 } } },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <GlassConfigProvider config={glassConfig}>{children}</GlassConfigProvider>
      </body>
    </html>
  );
}
```

`createGlassConfig` hace un merge profundo sobre los valores por defecto y devuelve datos planos, así que puedes llamarlo en el servidor. Con `flex: null` desactivas la deformación de un preset.

### Props de material (todas las primitivas)

| Prop | Tipo | Notas |
|---|---|---|
| `variant` | `"regular" \| "clear"` | `clear` es más transparente y lleva un oscurecido de fondo; úsalo solo sobre fotos o video. |
| `tint` | `"blue" \| "green" \| "red" \| "purple" \| "amber"` | Tinte sutil para acciones primarias o destructivas. |
| `radius` | `number` | Debe coincidir con el radio visual. |
| `refraction`, `bezel`, `blur` | `number` | Sobrescriben el preset para un elemento. |
| `preset` | `"control" \| "surface"` | Familia de configuración (por defecto `control` en `GlassButton`). |

## Crear tus propias primitivas

La librería expone los mismos bloques con los que está hecho `GlassButton`:

```tsx
"use client";
import { motion } from "motion/react";
import { useRef } from "react";
import { cx, useGlassConfig, useGlassMaterial, useGlassMotion } from "aria-glass-ui";

export function GlassChip({ children }: { children: React.ReactNode }) {
  const { presets } = useGlassConfig();
  const ref = useRef<HTMLButtonElement>(null);
  const glass = useGlassMaterial(ref, { ...presets.control.material, radius: 16 });
  const press = useGlassMotion(presets.control.motion);

  return (
    <motion.button
      {...glass.dataAttributes}
      {...press.handlers}
      ref={ref}
      className={cx(glass.className, press.className, "lg-btn")}
      style={{ ...glass.style, ...press.motionProps.style }}
    >
      <span>{children}</span>
    </motion.button>
  );
}
```

## Navegadores

- **Chromium** (Chrome, Edge, Arc, Brave, Opera): refracción real.
- **Safari y Firefox**: ignoran el filtro SVG en `backdrop-filter` y quedan con blur + brillos; se ven como vidrio, pero sin la lente.
- Respeta `prefers-reduced-motion` (sin crecer ni deformarse), `prefers-reduced-transparency` (superficie opaca) y `prefers-contrast`.

## Licencia

MIT. Incluye el motor LiquidLens (MIT), ver [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
