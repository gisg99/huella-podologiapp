// Normalización de texto para búsqueda tolerante a acentos y mayúsculas.
// "José Pérez" y "jose perez" coinciden.
export function normalizeText(value) {
  if (!value) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/** Iniciales para el avatar (máximo 2 letras). */
export function initials(fullName) {
  if (!fullName) return '·';
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** ¿`haystack` contiene todas las palabras de `query` (normalizadas)? */
export function matchesSearch(haystack, query) {
  const h = normalizeText(haystack);
  const q = normalizeText(query);
  if (!q) return true;
  return q.split(' ').every((token) => h.includes(token));
}
