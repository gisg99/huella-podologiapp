import { useRef } from 'react';
import {
  FOOT_VIEWBOX,
  FOOT_W,
  FOOT_OUTLINE,
  FOOT_TOES,
  FOOT_ARCH,
} from './footGeometry.js';

// Silueta del pie (plantar o dorsal) con un lienzo para superponer marcas o
// puntos. `side` 'right'|'left' (el izquierdo se dibuja espejado). `onPlace`,
// si se pasa, recibe {x,y} en coordenadas del lienzo al tocar. Las marcas
// (`children`) se dibujan SIN espejar: se guardan ya en el sistema visible.
export default function FootSvg({ side, view = 'plantar', onPlace, children, ariaLabel }) {
  const svgRef = useRef(null);
  const mirror = side === 'left';

  function handleClick(e) {
    if (!onPlace) return;
    const svg = svgRef.current;
    if (!svg || typeof svg.getScreenCTM !== 'function') return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    onPlace({ x: Math.round(loc.x * 10) / 10, y: Math.round(loc.y * 10) / 10 });
  }

  return (
    <svg
      ref={svgRef}
      viewBox={FOOT_VIEWBOX}
      role="img"
      aria-label={ariaLabel}
      onClick={handleClick}
      className="block h-auto w-full"
      style={{ cursor: onPlace ? 'crosshair' : 'default', touchAction: 'manipulation' }}
    >
      <g transform={mirror ? `translate(${FOOT_W},0) scale(-1,1)` : undefined}>
        <path d={FOOT_OUTLINE} fill="var(--color-surface-2)" stroke="var(--color-line)" strokeWidth={2} />
        {FOOT_TOES.map((t, i) => (
          <ellipse
            key={i}
            cx={t[0]}
            cy={t[1]}
            rx={t[2]}
            ry={t[3]}
            fill="var(--color-surface-2)"
            stroke="var(--color-line)"
            strokeWidth={2}
          />
        ))}
        {view === 'dorsal'
          ? FOOT_TOES.map((t, i) => (
              <rect
                key={`nail-${i}`}
                x={t[0] - t[2] * 0.55}
                y={t[1] - t[3] * 0.72}
                width={t[2] * 1.1}
                height={t[3] * 0.72}
                rx={2}
                fill="var(--color-line)"
              />
            ))
          : (
            <path
              d={FOOT_ARCH}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth={1.4}
              strokeDasharray="3 4"
            />
          )}
      </g>
      {children}
    </svg>
  );
}
