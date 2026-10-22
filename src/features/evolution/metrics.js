// Extracción de series numéricas de las visitas para las gráficas de evolución.
// Solo configuración estructural; las etiquetas (es-MX) viven en text.js (METRICS).
import { SW_POINTS_PER_FOOT } from '../../constants/domain.js';

export function toNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

// Índice tobillo-brazo = presión de tobillo ÷ presión de brazo.
function itb(ankle, arm) {
  const a = toNum(ankle);
  const b = toNum(arm);
  if (a == null || !b) return null; // sin brazo (o 0) → sin índice
  return a / b;
}

// Nº de puntos sensibles; null si la visita no evaluó ninguno.
function sensitiveCount(s) {
  if (!s) return null;
  const arr = [...(s.right || []), ...(s.left || [])];
  const evaluated = arr.filter((x) => x && x !== 'notEvaluated');
  if (evaluated.length === 0) return null;
  return arr.filter((x) => x === 'sensitive').length;
}

export const SW_MAX = SW_POINTS_PER_FOOT * 2;

export const METRICS = [
  { key: 'hgt', dec: 0, pick: (v) => toNum(v.vitals?.hgt) },
  { key: 'weight', dec: 1, pick: (v) => toNum(v.weight) },
  { key: 'eva', dec: 0, lo: 0, hi: 10, pick: (v) => toNum(v.vitals?.eva) },
  { key: 'sw', dec: 0, lo: 0, hi: SW_MAX, pick: (v) => sensitiveCount(v.sensitivity) },
  { key: 'lesions', dec: 0, lo: 0, pick: (v) => (Array.isArray(v.lesionMarks) ? v.lesionMarks.length : 0) },
  {
    key: 'bp',
    dec: 0,
    two: true,
    pick: (v) => toNum(v.vitals?.bpSystolic),
    pick2: (v) => toNum(v.vitals?.bpDiastolic),
  },
  {
    key: 'itb',
    dec: 2,
    two: true,
    pick: (v) => itb(v.abi?.ankleSystolic?.right, v.abi?.armSystolic?.right),
    pick2: (v) => itb(v.abi?.ankleSystolic?.left, v.abi?.armSystolic?.left),
  },
];

/**
 * Serie alineada por visita (orden ascendente por fecha). `a`/`b` pueden ser
 * null cuando esa visita no registró el dato. Devuelve también último valor,
 * cambio vs. la medición previa y si hay datos para mostrar la métrica.
 */
export function metricSeries(metric, visitsAsc) {
  const rows = visitsAsc.map((v) => ({
    date: v.date,
    a: metric.pick(v),
    b: metric.pick2 ? metric.pick2(v) : null,
  }));
  const withA = rows.filter((r) => r.a != null);
  const last = withA.length ? withA[withA.length - 1].a : null;
  const prev = withA.length > 1 ? withA[withA.length - 2].a : null;
  return {
    rows,
    hasData: withA.length > 0,
    count: withA.length,
    last,
    delta: last != null && prev != null ? last - prev : null,
  };
}

/** Formatea un número de métrica con sus decimales. */
export function fmtMetric(value, dec) {
  if (value == null) return '—';
  return value.toFixed(dec);
}
