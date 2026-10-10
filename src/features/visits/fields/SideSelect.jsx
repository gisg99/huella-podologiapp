import ChangeTag from './ChangeTag.jsx';
import { FOOT_SIDES_SHORT } from '../../../constants/text.js';

// Selección por lado (Derecho / Izquierdo) de una misma variable del examen.
// options: [{ value, label }]. value = { right, left }. changed = { right, left }.
export default function SideSelect({ label, options, value, onChange, changed }) {
  const v = value || { right: null, left: null };
  const set = (side) => (val) => onChange({ ...v, [side]: val === v[side] ? null : val });

  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-col gap-2">
        {['right', 'left'].map((side) => (
          <div key={side} className="flex items-center gap-2">
            <span className="flex w-9 flex-none items-center gap-1 text-xs font-bold text-muted">
              {FOOT_SIDES_SHORT[side]}
              {changed?.[side] && <ChangeTag />}
            </span>
            <div className="flex flex-1 gap-1.5">
              {options.map((opt) => {
                const active = v[side] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set(side)(opt.value)}
                    className={`tap flex-1 rounded-lg border px-1 py-2 text-xs font-bold ${
                      active ? 'border-primary bg-primary text-primary-ink' : 'border-line bg-surface-2 text-muted'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
