// Geometría y símbolos del pie en SVG propio (sin librerías, offline y nítido
// en el PDF). Todo vive en un lienzo de 120 × 264: vista plantar del pie
// derecho; el izquierdo se espeja. Compartido por el mapa de lesiones y el
// Test de Semmes-Weinstein.

export const FOOT_W = 120;
export const FOOT_H = 264;
export const FOOT_VIEWBOX = `0 0 ${FOOT_W} ${FOOT_H}`;

// Silueta de la planta (pie derecho, dedos arriba, dedo gordo a la derecha).
export const FOOT_OUTLINE =
  'M24,64 C17,82 18,104 24,128 C29,150 27,176 36,202 C43,224 58,234 68,234 ' +
  'C83,234 95,222 97,198 C100,168 95,140 95,114 C95,92 95,74 88,62 ' +
  'C72,52 40,53 24,64 Z';

// Dedos: [cx, cy, rx, ry] del gordo (1.º) al pequeño (5.º).
export const FOOT_TOES = [
  [88, 36, 12, 15],
  [66, 25, 9, 13],
  [49, 23, 8, 12],
  [35, 27, 7, 11],
  [23, 35, 6.5, 10],
];

// Arco plantar (solo vista plantar), de guía anatómica.
export const FOOT_ARCH = 'M86,78 C92,110 90,150 80,186';

// Token de color de cada símbolo de lesión → variable CSS del tema.
export const SHAPE_COLOR = {
  primary: 'var(--color-primary)',
  ink: 'var(--color-ink)',
  accent: 'var(--color-accent)',
  danger: 'var(--color-danger)',
  warn: 'var(--color-warn)',
  muted: 'var(--color-muted)',
};

// Espeja una coordenada X del lienzo para el pie izquierdo.
export function mirrorX(x, side) {
  return side === 'left' ? FOOT_W - x : x;
}
