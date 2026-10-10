import ChangeTag from './ChangeTag.jsx';
import { FOOT_TYPES } from '../../../constants/domain.js';
import { FOOT_TYPES as FOOT_TYPE_LABELS } from '../../../constants/text.js';

// Alturas relativas de los 5 dedos (del grueso al pequeño) por tipo de pie.
const TOES = {
  egyptian: [13, 10.5, 8.5, 6.5, 5],
  roman: [10.5, 10.5, 10.5, 7.5, 6],
  greek: [9, 12.5, 9.5, 7.5, 6],
  germanic: [13.5, 7.5, 7, 6.5, 5.5],
  celtic: [8.5, 12.5, 10.5, 7.5, 6],
};

function FootGlyph({ type, active }) {
  const toes = TOES[type];
  const color = active ? 'var(--c-primary)' : 'var(--c-muted)';
  const baseY = 24;
  return (
    <svg width="44" height="30" viewBox="0 0 44 30" aria-hidden="true">
      {toes.map((h, i) => (
        <rect
          key={i}
          x={5 + i * 7.5}
          y={baseY - h}
          width={5.5}
          height={h}
          rx={2.5}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
        />
      ))}
      {/* empeine */}
      <path d={`M4 ${baseY} Q22 ${baseY + 4} 40 ${baseY}`} stroke={color} strokeWidth="1.6" fill="none" />
    </svg>
  );
}

// Tarjetas seleccionables de tipo de pie (una).
export default function FootTypeCards({ value, onChange, changed, prevLabel }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        {changed && <ChangeTag>{prevLabel}</ChangeTag>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {FOOT_TYPES.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? null : t)}
              className={`tap flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 ${
                active ? 'border-primary bg-primary-soft' : 'border-line bg-surface'
              }`}
            >
              <FootGlyph type={t} active={active} />
              <span className={`text-xs font-bold ${active ? 'text-primary' : 'text-muted'}`}>
                {FOOT_TYPE_LABELS[t]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
