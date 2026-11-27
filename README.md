# Sistema de Gestión de Ventas con Variabilidad

Aplicación React + Vite + Tailwind CSS con dos variantes del producto (**Básica** y **Premium**) a partir de una única base de código.

**Producción:** https://proyecto-variabilidad-ventas.vercel.app (variante `basic`)

## Variantes

| Característica | Básica | Premium |
|---|:--:|:--:|
| Inicio de sesión (roles `admin` / `vendedor`) | ✅ | ✅ |
| Productos (CRUD, stock, precios) | ✅ | ✅ |
| Clientes | ✅ | ✅ |
| Ventas (subtotal, IVA 15 %, total) | ✅ | ✅ |
| Reportes estadísticos (KPIs y gráficos) | ❌ | ✅ |
| Descuentos en ventas | ❌ | ✅ |
| Exportación CSV / PDF | ❌ | ✅ |

La variante se elige con `VITE_APP_VARIANT=basic|premium` y se define en `src/config/variants.json`.
`scripts/validate-config.js` comprueba antes de cada build que las características obligatorias estén activas y que no existan combinaciones inválidas.

## Puesta en marcha

```bash
npm ci
npm run dev                 # variante basic
# PowerShell: $env:VITE_APP_VARIANT="premium"; npm run dev
npm test                    # pruebas (Vitest)
npm run validate-config     # validar variants.json
npm run build               # genera dist/
```

Usuarios de demostración: `admin / admin123` y `vendedor / venta123`.

## Auditoría de UI (`break-ui`)

La skill está en `.agent/skills/break-ui/SKILL.md`. En desarrollo, `?data=demo|worst|empty|one` carga datos límite (el selector aparece abajo al centro y no existe en producción).

## CI/CD

- `.github/workflows/ci.yml`: en push/PR a `main` o `develop` instala, valida configuración, ejecuta pruebas, compila y sube `dist/` como artefacto.
- `.github/workflows/cd.yml`: en push a `main`, solo si CI pasa, despliega a Vercel. Requiere los secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`, y opcionalmente la variable `APP_VARIANT`.
- `render.yaml` es la alternativa para Render.

## Flujo de ramas

`main` (releases) ← `develop` ← `feature/*` (`core-ventas`, `ci-testing`, `cd-deploy`, `variabilidad-flags`). Versionado semántico; ver [CHANGELOG.md](CHANGELOG.md).

## Equipo

| Integrante | GitHub | Responsabilidad |
|---|---|---|
| Julissa Lescano | JLP2323 | Arquitectura, repositorio y releases, módulos Core |
| Dayanara Guerrero | DayaGuerrero2005 | CI y pruebas automatizadas |
| Eduardo Quinteros | JavicSoftCode-01 | Fallo/corrección de CI y CD |
| Kevin Barboza | Barbozakevin | Variabilidad, validador y auditoría `break-ui` |
