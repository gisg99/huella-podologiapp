import Icon from '../../../components/Icon.jsx';

// Chip de encendido/apagado (tratamiento, antecedentes).
export default function CheckChip({ label, checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`tap flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
        checked ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-surface text-muted'
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-md border ${
          checked ? 'border-primary bg-primary text-primary-ink' : 'border-line'
        }`}
      >
        {checked && <Icon name="check" size={13} stroke={3} />}
      </span>
      {label}
    </button>
  );
}
