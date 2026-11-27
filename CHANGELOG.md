# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

## [1.1.0] - 2026-11-27

Integración de variabilidad y pipelines CI/CD.

### Added
- Motor de variabilidad con `src/config/variants.json` y `VITE_APP_VARIANT` (`basic` | `premium`). (@Barbozakevin)
- Variante Premium: reportes estadísticos, descuentos en ventas y exportación CSV/PDF. (@Barbozakevin)
- `scripts/validate-config.js`: validación de configuración previa al build. (@Barbozakevin)
- Fixtures `Demo`, `Worst case`, `Empty`, `One` y selector `?data=` solo en desarrollo (auditoría `break-ui`). (@Barbozakevin)
- Suite de pruebas automatizadas `tests/ventas.test.js` y `tests/variabilidad.test.js`. (@DayaGuerrero2005)
- Pipeline CI (`.github/workflows/ci.yml`): install, validación, pruebas, build y artefacto `dist/`. (@DayaGuerrero2005)
- Pipeline CD (`.github/workflows/cd.yml`) con despliegue a Vercel/Render solo en `main`. (@JavicSoftCode-01)

### Fixed
- Corrección de prueba fallida intencional registrada en Actions. (@JavicSoftCode-01)

## [1.0.0] - 2026-11-26

Versión base funcional (Variante Básica).

### Added
- Skill `break-ui` en `.agent/skills/break-ui/SKILL.md`. (@JLP2323)
- Arquitectura base React + Vite + Tailwind CSS. (@JLP2323)
- Inicio de sesión simulado con roles y sesión persistente. (@JLP2323)
- Gestión de Productos (CRUD, stock, precios). (@JLP2323)
- Gestión de Clientes (registro y listado). (@JLP2323)
- Registro de Ventas con subtotal, IVA y total, y descuento de stock. (@JLP2323)

[Unreleased]: https://github.com/JLP2323/Proyecto-variabilidad-ventas/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/JLP2323/Proyecto-variabilidad-ventas/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/JLP2323/Proyecto-variabilidad-ventas/releases/tag/v1.0.0
