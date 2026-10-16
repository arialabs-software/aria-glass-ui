# Changelog

Todas las versiones siguen [SemVer](https://semver.org/lang/es/). Mientras la versión sea `0.x`, un cambio de minor (`0.1` → `0.2`) puede romper la API.

## 0.1.0

- `GlassButton`: botón Liquid Glass con refracción real, crecimiento y brillo interior al presionar, deformación tipo gel anclada y asimétrica, y cancelación del tap al soltar a más de 70px.
- Configuración centralizada: `GlassConfig`, `defaultGlassConfig`, `createGlassConfig`, `GlassConfigProvider`, `useGlassConfig`; presets `control` y `surface`.
- Bloques para primitivas propias: `useGlassMaterial`, `useGlassMotion`, `getEngine`, `cx`.
- Hoja de estilos única: `aria-glass-ui/styles.css`.
