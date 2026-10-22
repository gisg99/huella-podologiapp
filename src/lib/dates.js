// Utilidades de fecha. La edad se calcula, nunca se guarda.

const DATE_FMT = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const DATETIME_FMT = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const SHORT_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short' });

/** "09 oct" (sin año), para ejes y etiquetas compactas. */
export function formatDateShort(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return SHORT_FMT.format(d);
}

/** Edad en años a partir de la fecha de nacimiento (ISO o Date). */
export function calcAge(birthDate, at = new Date()) {
  if (!birthDate) return null;
  const b = birthDate instanceof Date ? birthDate : new Date(birthDate);
  if (Number.isNaN(b.getTime())) return null;
  const now = at instanceof Date ? at : new Date(at);
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

/** "09 oct 2026" */
export function formatDate(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return DATE_FMT.format(d);
}

/** "09 oct 2026, 14:30" */
export function formatDateTime(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return DATETIME_FMT.format(d);
}

/** Días transcurridos (enteros) desde una fecha hasta ahora. */
export function daysSince(value, at = new Date()) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const now = at instanceof Date ? at : new Date(at);
  const ms = now.getTime() - d.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** Texto relativo breve en español: "hoy", "hace 3 días", "hace 2 sem.", … */
export function relativeDays(value, at = new Date()) {
  const d = daysSince(value, at);
  if (d === null) return '';
  if (d <= 0) return 'hoy';
  if (d === 1) return 'ayer';
  if (d < 7) return `hace ${d} días`;
  if (d < 30) {
    const w = Math.floor(d / 7);
    return `hace ${w} ${w === 1 ? 'semana' : 'sem.'}`;
  }
  if (d < 365) {
    const mo = Math.floor(d / 30);
    return `hace ${mo} ${mo === 1 ? 'mes' : 'meses'}`;
  }
  const y = Math.floor(d / 365);
  return `hace ${y} ${y === 1 ? 'año' : 'años'}`;
}

/** Fecha de hoy en formato de input date (YYYY-MM-DD), hora local. */
export function todayInputValue(at = new Date()) {
  const d = at instanceof Date ? at : new Date(at);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}
