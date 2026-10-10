import { Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStoragePersist } from '../app/useStoragePersist.js';
import { useProfile } from '../app/useProfile.js';
import { usePatients } from '../features/patients/usePatients.js';
import { BrandMark } from '../components/Brand.jsx';
import Icon from '../components/Icon.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Button from '../components/ui/Button.jsx';
import PatientCard from '../features/patients/PatientCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { settingsRepo } from '../db/index.js';
import { daysSince } from '../lib/dates.js';
import { APP, NAV, ACTIONS, MESSAGES } from '../constants/text.js';
import { DEFAULT_BACKUP_REMINDER_DAYS } from '../constants/domain.js';

export default function Home() {
  const navigate = useNavigate();
  const { persisted } = useStoragePersist();
  const profile = useProfile();
  const patients = usePatients();
  const lastBackupAt = useLiveQuery(() => settingsRepo.getLastBackupAt(), []);

  const recent = (patients ?? []).slice(0, 5);
  const backupDays = lastBackupAt ? daysSince(lastBackupAt) : null;
  const backupOverdue = lastBackupAt == null || (backupDays ?? 0) >= DEFAULT_BACKUP_REMINDER_DAYS;

  const firstName = profile?.name ? profile.name.split(/\s+/)[0] : null;

  return (
    <div className="flex flex-col gap-5 px-4 pb-24 pt-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BrandMark size={44} />
          <div>
            <h1 className="text-2xl leading-none">{APP.name}</h1>
            <p className="mt-1 text-sm text-muted">
              {firstName ? `Hola, ${firstName}` : APP.tagline}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
          <Icon name="wifiOff" size={14} stroke={2.3} />
          {APP.offline}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
            persisted ? 'bg-surface-2 text-muted' : 'bg-accent-soft text-accent'
          }`}
        >
          <Icon name="shield" size={13} />
          {persisted === null
            ? MESSAGES.loading
            : persisted
              ? MESSAGES.storagePersisted
              : MESSAGES.storageNotPersisted}
        </span>
      </div>

      {/* Aviso de respaldo */}
      <Link
        to="/respaldo"
        className={`tap flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
          backupOverdue ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted'
        }`}
      >
        <Icon name="backup" size={18} className="flex-none" />
        <span className="flex-1">
          {lastBackupAt == null
            ? MESSAGES.noBackupYet
            : MESSAGES.backupReminder(backupDays)}
        </span>
        <Icon name="chevron" size={16} className="flex-none" />
      </Link>

      <Button full icon="plus" onClick={() => navigate('/pacientes/nuevo')}>
        {ACTIONS.newPatient}
      </Button>

      {/* Pacientes recientes */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            {NAV.patients} recientes
          </p>
          {recent.length > 0 && (
            <Link to="/pacientes" className="text-sm font-semibold text-primary">
              Ver todos
            </Link>
          )}
        </div>
        {patients === undefined ? (
          <p className="py-6 text-center text-sm text-muted">{MESSAGES.loading}</p>
        ) : recent.length === 0 ? (
          <EmptyState icon="users">{MESSAGES.noPatients}</EmptyState>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recent.map((p) => (
              <PatientCard key={p.id} patient={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
