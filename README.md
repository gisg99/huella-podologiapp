# Huella · Expediente Podológico

PWA offline para que un podólogo gestione expedientes clínicos desde el teléfono,
sin conexión. El teléfono es la única fuente de verdad: todos los datos viven en
el dispositivo (IndexedDB) y se respaldan a un archivo.

## Stack

- **React 19 + Vite** (JavaScript)
- **Tailwind CSS v4** (`@tailwindcss/vite`) — tokens de tema en `src/index.css`
- **Dexie.js** (IndexedDB) con esquema versionado y repositorios en `src/db/`
- **react-router-dom** con `HashRouter` (hosting estático / offline)
- **vite-plugin-pwa** (Workbox, `autoUpdate`, precache de todo el app shell)
- Fuentes **self-hosted** (Fraunces + Plus Jakarta Sans, vía `@fontsource`) — sin CDN

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción (genera SW + manifest)
npm run preview   # sirve el build (con service worker) para probar offline
npm run lint      # ESLint
```

## Estructura

```
src/
  app/          # router, layout, tema, hooks de PWA y almacenamiento
  components/   # UI reutilizable (iconos, navegación, marca…)
  constants/    # dominio (claves en inglés) y textos es-MX, centralizados
  db/           # Dexie + repositorios (capa de datos aislada)
  lib/          # utilidades (ids, fechas/edad, normalización de texto)
  pages/        # pantallas por ruta
```

## Probar offline

1. `npm run build && npm run preview`
2. Abrir en el navegador del teléfono e **instalar** la PWA.
3. Activar modo avión, cerrar y volver a abrir: el app shell debe cargar igual.

## Fases

- [x] **Fase 0** — Andamiaje: carpetas, Tailwind, PWA offline, Dexie (esquema
      versionado + repositorios), router, constantes de dominio y textos.
- [ ] Fase 1 — Perfil del especialista (onboarding) + pacientes (alta, edición, búsqueda).
- [ ] Fase 2 — Visita por pasos (autoguardado, precarga, resaltado de cambios).
- [ ] Fase 3 — Pies en SVG: mapa de lesiones y Semmes-Weinstein.
- [ ] Fase 4 — Historial, comparación y gráficas de evolución.
- [ ] Fase 5 — Fotos con compresión y almacenamiento.
- [ ] Fase 6 — Exportación a PDF (visita y expediente completo).
- [ ] Fase 7 — Respaldo (exportar/importar), PIN, persistencia y avisos.
- [ ] Fase 8 — Pulido, accesibilidad, pruebas en teléfono real.

## Pendientes a validar con el especialista (NOM-004-SSA3-2012 y datos personales)

> No es asesoría legal; son puntos a revisar antes de uso real.

- Aviso de privacidad y consentimiento del paciente para el tratamiento de datos.
- Conservación del expediente clínico (tiempos y responsable del resguardo).
- Datos personales sensibles de salud: no se envía nada a servicios externos,
  sin analíticas ni telemetría.
