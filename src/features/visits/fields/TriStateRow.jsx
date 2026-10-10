import ChangeTag from './ChangeTag.jsx';
import { PRESENCE as PRESENCE_LABELS, YES_NO } from '../../../constants/text.js';

const SIDE_OPTIONS = ['right', 'left', 'both'];

// Selector tri-estado reutilizable (sección 6.4): base Sí/No con lado opcional.
// value = { value: 'yes'|'no'|null, side: 'none'|'right'|'left'|'both' }
export default function TriStateRow({ label, value, onChange, changed }) {
  const v = value || { value: null, side: 'none' };

  function setValue(next) {
    onChange({ value: next === v.value ? null : next, side: next === 'yes' ? v.side : 'none' });
  }
  function setSide(side) {
    onChange({ ...v, side: side === v.side ? 'none' : side });
  }

  return (
    <div className={`rounded-xl border p-3 ${changed ? 'border-accent bg-accent-soft/40' : 'border-line bg-surface'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <div className="flex items-center gap-2">
          {changed && <ChangeTag />}
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-pressed={v.value === 'yes'}
              onClick={() => setValue('yes')}
              className={`tap rounded-lg px-3.5 py-1.5 text-sm font-bold ${
                v.value === 'yes' ? 'bg-primary text-primary-ink' : 'bg-surface-2 text-muted'
              }`}
            >
              {YES_NO.yes}
            </button>
            <button
              type="button"
              aria-pressed={v.value === 'no'}
              onClick={() => setValue('no')}
              className={`tap rounded-lg px-3.5 py-1.5 text-sm font-bold ${
                v.value === 'no' ? 'bg-ink text-bg' : 'bg-surface-2 text-muted'
              }`}
            >
              {YES_NO.no}
            </button>
          </div>
        </div>
      </div>
      {v.value === 'yes' && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-muted">Lado:</span>
          {SIDE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={v.side === s}
              onClick={() => setSide(s)}
              className={`tap rounded-full border px-3 py-1 text-xs font-bold ${
                v.side === s ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-surface text-muted'
              }`}
            >
              {PRESENCE_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
