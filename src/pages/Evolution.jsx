import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import { Card, GroupLabel } from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { usePatient } from '../features/patients/usePatients.js';
import { visitRepo } from '../db/index.js';
import { METRICS, metricSeries, fmtMetric } from '../features/evolution/metrics.js';
import { Sparkline, FocusChart } from '../features/evolution/charts.jsx';
import { METRICS as METRIC_LABELS, EVOLUTION, MESSAGES } from '../constants/text.js';

function lastPair(m, s) {
  const lastA = s.last;
  const lastB = m.two ? ([...s.rows].reverse().find((r) => r.b != null)?.b ?? null) : null;
  if (m.two && lastB != null) return `${fmtMetric(lastA, m.dec)}/${fmtMetric(lastB, m.dec)}`;
  return fmtMetric(lastA, m.dec);
}

function Delta({ value, dec }) {
  if (value == null || value === 0) {
    return <span className="text-muted">→ {EVOLUTION.vsPrev}</span>;
  }
  const up = value > 0;
  return (
    <span className="text-muted">
      {up ? '▲' : '▼'} {up ? '+' : ''}
      {fmtMetric(value, dec)} {EVOLUTION.vsPrev}
    </span>
  );
}

export default function Evolution() {
  const { id } = useParams();
  const patient = usePatient(id);
  const visits = useLiveQuery(() => (id ? visitRepo.listByPatient(id) : []), [id]);
  const [sel, setSel] = useState(null);

  const finalizedAsc = useMemo(
    () =>
      (visits || [])
        .filter((v) => v.status === 'finalized')
        .slice()
        .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    [visits],
  );
  const available = useMemo(
    () => METRICS.map((m) => ({ m, s: metricSeries(m, finalizedAsc) })).filter((x) => x.s.hasData),
    [finalizedAsc],
  );

  if (patient === undefined || visits === undefined) {
    return (
      <div>
        <AppHeader title={EVOLUTION.title} back />
        <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
      </div>
    );
  }

  const current = available.find((x) => x.m.key === sel) || available[0];

  return (
    <div>
      <AppHeader title={EVOLUTION.title} subtitle={patient?.fullName} back />

      <div className="flex flex-col gap-5 px-4 pb-24 pt-4">
        {available.length === 0 ? (
          <EmptyState icon="chart">{EVOLUTION.noData}</EmptyState>
        ) : (
          <>
            <Card className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{METRIC_LABELS[current.m.key].label}</p>
                  <p className="mt-1">
                    <span className="tabular text-3xl font-extrabold">{lastPair(current.m, current.s)}</span>{' '}
                    <span className="text-sm font-semibold text-muted">{METRIC_LABELS[current.m.key].unit}</span>
                  </p>
                  <p className="mt-0.5 text-xs font-bold">
                    <Delta value={current.s.delta} dec={current.m.dec} />
                  </p>
                </div>
              </div>
              <div className="mt-1">
                <FocusChart metric={current.m} rows={current.s.rows} labels={METRIC_LABELS[current.m.key]} />
              </div>
              {current.s.count < 2 && <p className="text-center text-xs text-muted">{EVOLUTION.oneVisit}</p>}
            </Card>

            <div>
              <GroupLabel>{EVOLUTION.metrics}</GroupLabel>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {available.map(({ m, s }) => {
                  const active = m.key === current.m.key;
                  const lab = METRIC_LABELS[m.key];
                  return (
                    <button
                      key={m.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSel(m.key)}
                      className={`tap flex flex-col gap-1.5 rounded-2xl border bg-surface p-3 text-left ${
                        active ? 'border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]' : 'border-line'
                      }`}
                    >
                      <span className="text-[11.5px] font-bold leading-tight text-muted">{lab.label}</span>
                      <span className="tabular text-lg font-extrabold">
                        {lastPair(m, s)}
                        {lab.unit && <span className="ml-1 text-[11px] font-semibold text-muted">{lab.unit}</span>}
                      </span>
                      <Sparkline rows={s.rows} two={m.two} lo={m.lo} hi={m.hi} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
