import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import Icon from '../components/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import PatientCard from '../features/patients/PatientCard.jsx';
import { usePatients } from '../features/patients/usePatients.js';
import { matchesSearch } from '../lib/strings.js';
import { NAV, ACTIONS, MESSAGES } from '../constants/text.js';

export default function Patients() {
  const navigate = useNavigate();
  const patients = usePatients();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!patients) return [];
    if (!query.trim()) return patients;
    return patients.filter((p) => matchesSearch(p.fullName, query));
  }, [patients, query]);

  const loading = patients === undefined;
  const hasAny = (patients?.length ?? 0) > 0;

  return (
    <div>
      <AppHeader
        title={NAV.patients}
        right={
          <Button icon="plus" onClick={() => navigate('/pacientes/nuevo')} className="!px-3 !py-2">
            Nuevo
          </Button>
        }
      />
      <div className="flex flex-col gap-3 px-4 pb-24 pt-4">
        {hasAny && (
          <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-3">
            <Icon name="search" size={18} className="flex-none text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ACTIONS.search}
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/70"
              aria-label="Buscar paciente"
            />
          </label>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
        ) : !hasAny ? (
          <EmptyState
            icon="users"
            title="Sin pacientes"
            action={
              <Button icon="plus" onClick={() => navigate('/pacientes/nuevo')}>
                {ACTIONS.newPatient}
              </Button>
            }
          >
            {MESSAGES.noPatients}
          </EmptyState>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            No se encontraron pacientes para “{query}”.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((p) => (
              <PatientCard key={p.id} patient={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
