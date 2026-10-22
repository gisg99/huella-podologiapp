import { SHAPE_COLOR } from './footGeometry.js';

// Dibuja el símbolo de una lesión centrado en (0,0), radio `r`. Cada lesión se
// distingue por forma Y color, de modo que siga siendo legible en blanco y
// negro (impresión / PDF). `colorToken` viene de LESION_SYMBOLS (domain.js).
export function Shape({ shape, colorToken, r = 7 }) {
  const fill = SHAPE_COLOR[colorToken] || 'var(--color-ink)';
  const sw = (r * 0.42).toFixed(1);
  switch (shape) {
    case 'circle':
      return <circle r={r} fill={fill} />;
    case 'ring':
      return <circle r={r} fill="none" stroke={fill} strokeWidth={sw} />;
    case 'square':
      return <rect x={-r} y={-r} width={2 * r} height={2 * r} rx={r * 0.2} fill={fill} />;
    case 'diamond':
      return <rect x={-r} y={-r} width={2 * r} height={2 * r} fill={fill} transform="rotate(45)" />;
    case 'triangle':
      return <path d={`M0,${-r} L${r},${r * 0.85} L${-r},${r * 0.85} Z`} fill={fill} />;
    case 'triangleDown':
      return <path d={`M0,${r} L${r},${-r * 0.85} L${-r},${-r * 0.85} Z`} fill={fill} />;
    case 'cross': {
      const d = r * 0.8;
      return (
        <path
          d={`M${-d},${-d} L${d},${d} M${-d},${d} L${d},${-d}`}
          stroke={fill}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );
    }
    case 'plus':
      return (
        <path
          d={`M0,${-r} L0,${r} M${-r},0 L${r},0`}
          stroke={fill}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

// Símbolo suelto en un SVG pequeño, para la leyenda y las listas.
export function Swatch({ shape, colorToken, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" aria-hidden="true" className="flex-none">
      <Shape shape={shape} colorToken={colorToken} r={7} />
    </svg>
  );
}
