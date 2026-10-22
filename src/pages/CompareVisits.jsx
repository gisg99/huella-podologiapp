import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ChangeTag from '../features/visits/fields/ChangeTag.jsx';
import { usePatient } from '../features/patients/usePatients.js';
import { visitRepo } from '../db/index.js';
import { COMPARE_SECTIONS } from '../features/evolution/compareFields.js';
import { formatDate } from '../lib/dates.js';
import { COMPARE, MESSAGES } from '../constants/text.js';

function Picker({ label, value, onChange, visits }) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1 block text-[10.5px] font-extrabold uppercase tracking-wide text-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-surface-2 px-2.5 py-2.5 text-sm font-semibold text-ink"
      >
        {visits.map((v) => (
          <option key={v.id} value={v.id}>
            {formatDate(v.date)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CompareVisits() {
  const { id } = useParams();
  const patient = usePatient(id);
  const visits = useLiveQuery(() => (id ? visitRepo.listByPatient(id) : []), [id]);
  const [aId, setAId] = useState(null);
  const [bId, setBId] = useState(null);

  const finalized = useMemo(() => (visits || []).filter((v) => v.status === 'finalized'), [visits]);

  if (patient === undefined || visits === undefined) {
    return (
      <div>
        <AppHeader title={COMPARE.title} back />
        <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
      </div>
    );
  }

  const header = <AppHeader title={COMPARE.title} subtitle={patient?.fullName} back />;

  if (finalized.length < 2) {
    return (
      <div>
        {header}
        <div className="px-4 pt-6">
          <EmptyState icon="compare">{COMPARE.need2}</EmptyState>
        </div>
      </div>
    );
  }

  // Por defecto: A = penúltima finalizada, B = la más reciente (finalized va de
  // más reciente a más antigua).
  const effA = aId ?? finalized[1].id;
  const effB = bId ?? finalized[0].id;
  const A = finalized.find((v) => v.id === effA);
  const B = finalized.find((v) => v.id === effB);
  const same = effA === effB;

  return (
    <div>
      {header}
      <div className="flex flex-col gap-5 px-4 pb-24 pt-4">
        <div className="flex items-center gap-2.5">
          <Picker label={COMPARE.visitA} value={effA} onChange={setAId} visits={finalized} />
          <span className="mt-5 flex-none text-muted">→</span>
          <Picker label={COMPARE.visitB} value={effB} onChange={setBId} visits={finalized} />
        </div>

        {same ? (
          <p className="py-6 text-center text-sm italic text-muted">{COMPARE.samePick}</p>
        ) : (
          <CompareTable a={A} b={B} />
        )}
      </div>
    </div>
  );
}

function CompareTable({ a, b }) {
  const sections = COMPARE_SECTIONS.map((sec) => ({
    key: sec.key,
    label: COMPARE.sections[sec.key],
    rows: sec.items
      .map((it) => ({ label: it.label, va: it.get(a), vb: it.get(b) }))
      .filter((r) => r.va || r.vb),
  })).filter((sec) => sec.rows.length > 0);

  const anyChange = sections.some((sec) => sec.rows.some((r) => r.va !== r.vb));

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      {sections.map((sec) => (
        <div key={sec.key}>
          <p className="border-t border-line bg-surface-2 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-muted first:border-t-0">
            {sec.label}
          </p>
          {sec.rows.map((r, i) => {
            const changed = r.va !== r.vb;
            return (
              <div
                key={i}
                className={`grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-t border-line px-3 py-2 ${
                  changed ? 'bg-accent-soft/40' : ''
                }`}
              >
                <span className="text-[11.5px] font-semibold text-muted">{r.label}</span>
                {changed && <ChangeTag />}
                <span className="col-span-2 flex items-baseline gap-2 text-sm">
                  <span className="tabular flex-1 text-muted">{r.va || '—'}</span>
                  <span className="text-muted">→</span>
                  <span className={`tabular flex-1 text-right font-bold ${changed ? 'text-accent' : 'text-ink'}`}>
                    {r.vb || '—'}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      ))}
      {!anyChange && <p className="border-t border-line py-4 text-center text-sm italic text-muted">{COMPARE.noChange}</p>}
    </div>
  );
}
