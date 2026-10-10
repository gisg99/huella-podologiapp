// Multi-selección con chips grandes. options: [{ value, label }].
export default function MultiChip({ options, selected = [], onToggle, columns = 2 }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(opt.value)}
            className={`tap rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
              active ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-surface text-muted'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
