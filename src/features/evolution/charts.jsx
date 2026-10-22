import { useRef, useState } from 'react';
import { formatDateShort } from '../../lib/dates.js';
import { fmtMetric } from './metrics.js';

const PRIMARY = 'var(--color-primary)';
const GRID = 'var(--color-line)';
const MUTED = 'var(--color-muted)';
const SURFACE = 'var(--color-surface)';

// Límites del eje: usa lo/hi fijos de la métrica o los deduce de los datos con
// un margen del 12 %.
function bounds(values, lo, hi) {
  const vals = values.filter((v) => v != null);
  let mn = lo != null ? lo : (vals.length ? Math.min(...vals) : 0);
  let mx = hi != null ? hi : (vals.length ? Math.max(...vals) : 1);
  if (mn === mx) {
    mn -= 1;
    mx += 1;
  }
  const span = mx - mn || 1;
  if (lo == null) mn -= span * 0.12;
  if (hi == null) mx += span * 0.12;
  return { lo: mn, hi: mx };
}

function linePath(points) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

// ---- Sparkline (tarjeta): sin ejes ni interacción ----
export function Sparkline({ rows, two, lo, hi, width = 150, height = 34 }) {
  const all = rows.flatMap((r) => [r.a, two ? r.b : null]);
  const b = bounds(all, lo, hi);
  const n = rows.length;
  const padX = 3;
  const padT = 4;
  const padB = 5;
  const innerW = width - padX * 2;
  const innerH = height - padT - padB;
  const xAt = (i) => padX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v) => padT + innerH - ((v - b.lo) / (b.hi - b.lo)) * innerH;

  const draw = (key) =>
    rows.map((r, i) => ({ i, v: r[key] })).filter((o) => o.v != null).map((o) => ({ x: xAt(o.i), y: yAt(o.v) }));
  const p1 = draw('a');
  const p2 = two ? draw('b') : [];
  if (!p1.length) return null;
  const last = p1[p1.length - 1];
  const baseY = padT + innerH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {p2.length > 1 && (
        <path d={linePath(p2)} fill="none" stroke={PRIMARY} strokeWidth={1.6} strokeDasharray="3 3" opacity={0.5} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {p1.length > 1 && (
        <path d={`${linePath(p1)} L${last.x.toFixed(1)},${baseY} L${p1[0].x.toFixed(1)},${baseY} Z`} fill={PRIMARY} opacity={0.08} />
      )}
      <path d={linePath(p1)} fill="none" stroke={PRIMARY} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2.6} fill={PRIMARY} />
    </svg>
  );
}

// ---- Gráfica grande con ejes mínimos y tooltip al deslizar ----
export function FocusChart({ metric, rows, labels }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const W = 384;
  const H = 168;
  const padX = 34;
  const padT = 12;
  const padB = 26;
  const innerW = W - padX * 2;
  const innerH = H - padT - padB;
  const n = rows.length;

  const all = rows.flatMap((r) => [r.a, metric.two ? r.b : null]);
  const b = bounds(all, metric.lo, metric.hi);
  const xAt = (i) => padX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v) => padT + innerH - ((v - b.lo) / (b.hi - b.lo)) * innerH;

  const draw = (key) =>
    rows.map((r, i) => ({ i, v: r[key] })).filter((o) => o.v != null).map((o) => ({ x: xAt(o.i), y: yAt(o.v), i: o.i }));
  const p1 = draw('a');
  const p2 = metric.two ? draw('b') : [];
  const baseY = padT + innerH;
  const last1 = p1[p1.length - 1];
  const last2 = p2.length ? p2[p2.length - 1] : null;

  const gridVals = [b.hi, (b.hi + b.lo) / 2, b.lo];

  function onMove(e) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const vx = ((clientX - rect.left) / rect.width) * W;
    const idx = n <= 1 ? 0 : Math.max(0, Math.min(n - 1, Math.round(((vx - padX) / innerW) * (n - 1))));
    setHover(idx);
  }
  const hideHover = () => setHover(null);

  const hoverRow = hover != null ? rows[hover] : null;
  const hoverX = hover != null ? xAt(hover) : 0;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        style={{ touchAction: 'pan-y', cursor: 'crosshair' }}
        onMouseMove={onMove}
        onMouseLeave={hideHover}
        onTouchStart={onMove}
        onTouchMove={onMove}
        onTouchEnd={hideHover}
      >
        {gridVals.map((val, i) => {
          const y = padT + (i / 2) * innerH;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={W - 6} y2={y} stroke={GRID} strokeWidth={1} />
              <text x={padX - 5} y={y + 3} textAnchor="end" fontSize={9} fill={MUTED} style={{ fontFamily: 'var(--font-sans)' }}>
                {fmtMetric(val, metric.dec)}
              </text>
            </g>
          );
        })}
        {[0, n - 1].map((idx) =>
          rows[idx] ? (
            <text
              key={`d${idx}`}
              x={xAt(idx)}
              y={H - 7}
              textAnchor={idx === 0 ? 'start' : 'end'}
              fontSize={9}
              fill={MUTED}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatDateShort(rows[idx].date)}
            </text>
          ) : null,
        )}

        {p1.length > 1 && (
          <path d={`${linePath(p1)} L${last1.x.toFixed(1)},${baseY} L${p1[0].x.toFixed(1)},${baseY} Z`} fill={PRIMARY} opacity={0.09} />
        )}
        {p2.length > 1 && (
          <path d={linePath(p2)} fill="none" stroke={PRIMARY} strokeWidth={2} strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
        )}
        {p2.map((p) => (
          <circle key={`b${p.i}`} cx={p.x} cy={p.y} r={2.2} fill={SURFACE} stroke={PRIMARY} strokeWidth={1.4} />
        ))}
        {p1.length > 1 && <path d={linePath(p1)} fill="none" stroke={PRIMARY} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />}
        {p1.map((p) => (
          <circle key={`a${p.i}`} cx={p.x} cy={p.y} r={2.6} fill={PRIMARY} />
        ))}
        {last1 && <circle cx={last1.x} cy={last1.y} r={4} fill={PRIMARY} stroke={SURFACE} strokeWidth={1.5} />}

        {metric.two && last1 && (
          <text x={last1.x - 3} y={last1.y - 6} textAnchor="end" fontSize={9} fontWeight={700} fill={PRIMARY} style={{ fontFamily: 'var(--font-sans)' }}>
            {labels.n1}
          </text>
        )}
        {metric.two && last2 && (
          <text x={last2.x - 3} y={last2.y - 6} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED} style={{ fontFamily: 'var(--font-sans)' }}>
            {labels.n2}
          </text>
        )}

        {hover != null && (
          <line x1={hoverX} y1={padT} x2={hoverX} y2={baseY} stroke={PRIMARY} strokeWidth={1} opacity={0.4} />
        )}
      </svg>

      {hoverRow && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg bg-ink px-2 py-1 text-[11px] font-bold text-bg shadow-card"
          style={{ left: `${(hoverX / W) * 100}%`, whiteSpace: 'nowrap' }}
        >
          <span className="opacity-70">{formatDateShort(hoverRow.date)}</span>{' '}
          {metric.two
            ? `${labels.n1} ${fmtMetric(hoverRow.a, metric.dec)} · ${labels.n2} ${fmtMetric(hoverRow.b, metric.dec)}`
            : `${fmtMetric(hoverRow.a, metric.dec)}${labels.unit ? ` ${labels.unit}` : ''}`}
        </div>
      )}
    </div>
  );
}
