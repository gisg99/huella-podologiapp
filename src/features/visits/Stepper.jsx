import { VISIT_STEPS } from '../../constants/domain.js';
import { VISIT_STEPS as STEP_LABELS } from '../../constants/text.js';

// Barra de progreso por pasos de la visita.
export default function Stepper({ index }) {
  const total = VISIT_STEPS.length;
  const pct = Math.round(((index + 1) / total) * 100);
  const title = STEP_LABELS[VISIT_STEPS[index]];
  return (
    <div className="px-4 pb-3 pt-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Paso {index + 1} de {total} · <b className="text-ink">{title}</b>
        </span>
        <span className="tabular">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
