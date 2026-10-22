import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import FootSvg from '../fields/FootSvg.jsx';
import { mirrorX } from '../fields/footGeometry.js';
import { emptySensitivity } from '../visitModel.js';
import { SW_POINTS, SW_POINT_STATES, FOOT_SIDES } from '../../../constants/domain.js';
import {
  SW_POINTS as POINT_LABELS,
  SW_POINT_STATES as STATE_LABELS,
  FOOT_SIDES as SIDE_LABELS,
  FOOT_MAP,
} from '../../../constants/text.js';

const FILL = {
  sensitive: 'var(--color-ok)',
  notSensitive: 'var(--color-danger)',
  notEvaluated: 'var(--color-surface)',
};
const STROKE = {
  sensitive: 'var(--color-ok)',
  notSensitive: 'var(--color-danger)',
  notEvaluated: 'var(--color-line)',
};
const TEXT = {
  sensitive: '#ffffff',
  notSensitive: '#ffffff',
  notEvaluated: 'var(--color-muted)',
};

// Rellena/recorta una sensibilidad almacenada a la forma canónica actual.
function normalize(sens) {
  const base = emptySensitivity();
  if (!sens) return base;
  return {
    right: base.right.map((d, i) => sens.right?.[i] ?? d),
    left: base.left.map((d, i) => sens.left?.[i] ?? d),
  };
}

export default function StepSensitivity({ form, prev, update }) {
  const sens = normalize(form.sensitivity);
  const hasPrev = Boolean(prev?.sensitivity);
  const prevSens = hasPrev ? normalize(prev.sensitivity) : null;

  const cycle = (side, i) => {
    const current = sens[side][i];
    const next = SW_POINT_STATES[(SW_POINT_STATES.indexOf(current) + 1) % SW_POINT_STATES.length];
    const arr = [...sens[side]];
    arr[i] = next;
    update({ sensitivity: { ...sens, [side]: arr } });
  };

  const all = [...sens.right, ...sens.left];
  const count = (state) => all.filter((s) => s === state).length;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-xs leading-relaxed text-muted">{FOOT_MAP.swHint}</p>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {SW_POINT_STATES.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border"
              style={{ background: FILL[s], borderColor: STROKE[s] }}
            />
            {STATE_LABELS[s]}
          </span>
        ))}
      </div>

      <Card className="flex gap-3">
        {FOOT_SIDES.map((side) => (
          <div key={side} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              {SIDE_LABELS[side]}
            </span>
            <FootSvg side={side} view="plantar" ariaLabel={`Puntos de sensibilidad, pie ${SIDE_LABELS[side].toLowerCase()}`}>
              {SW_POINTS.map((p, i) => {
                const state = sens[side][i];
                const changed = hasPrev && state !== 'notEvaluated' && prevSens[side][i] !== state;
                const x = mirrorX(p.x, side);
                return (
                  <g
                    key={p.key}
                    transform={`translate(${x},${p.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => cycle(side, i)}
                  >
                    {changed && (
                      <circle r={13} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
                    )}
                    <circle r={9.5} fill={FILL[state]} stroke={STROKE[state]} strokeWidth={2} />
                    <text
                      x={0}
                      y={0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      fontWeight={800}
                      fill={TEXT[state]}
                      style={{ fontFamily: 'var(--font-sans)', pointerEvents: 'none' }}
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </FootSvg>
          </div>
        ))}
      </Card>

      <div className="flex gap-2">
        {SW_POINT_STATES.map((s) => (
          <div key={s} className="flex-1 rounded-xl border border-line bg-surface-2 px-1 py-2 text-center">
            <p className="tabular text-xl font-extrabold" style={{ color: STROKE[s] === 'var(--color-line)' ? 'var(--color-muted)' : STROKE[s] }}>
              {count(s)}
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              {STATE_LABELS[s]}
            </p>
          </div>
        ))}
      </div>

      <div>
        <GroupLabel>{FOOT_MAP.swPointsTitle}</GroupLabel>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
          {SW_POINTS.map((p, i) => (
            <li key={p.key} className="flex items-center gap-2 text-[11.5px] text-muted">
              <span className="grid h-[17px] w-[17px] flex-none place-items-center rounded-full bg-surface-2 text-[10px] font-extrabold text-ink">
                {i + 1}
              </span>
              {POINT_LABELS[p.key]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
