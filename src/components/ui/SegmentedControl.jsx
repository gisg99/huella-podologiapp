// Grupo de chips grandes para elegir una opción (p. ej. sexo).
// options: [{ value, label }]
export default function SegmentedControl({ value, onChange, options, label, columns }) {
  const cols = columns || Math.min(options.length, 3);
  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-semibold text-ink">{label}</p>}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`tap rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? 'border-primary bg-primary text-primary-ink'
                  : 'border-line bg-surface text-muted'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
