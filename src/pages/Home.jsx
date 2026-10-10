import { useStoragePersist } from '../app/useStoragePersist.js';
import { BrandMark } from '../components/Brand.jsx';
import Icon from '../components/Icon.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { APP, NAV, ACTIONS, MESSAGES } from '../constants/text.js';

function formatBytes(n) {
  if (n == null) return '—';
  const mb = n / (1024 * 1024);
  if (mb < 1) return `${(n / 1024).toFixed(0)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export default function Home() {
  const { persisted, usage, quota } = useStoragePersist();

  return (
    <div className="flex flex-col gap-5 px-4 pb-24 pt-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BrandMark size={44} />
          <div>
            <h1 className="text-2xl leading-none">{APP.name}</h1>
            <p className="mt-1 text-sm text-muted">{APP.tagline}</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
        <Icon name="wifiOff" size={14} stroke={2.3} />
        {APP.offline}
      </div>

      {/* Estado del almacenamiento (persistencia pedida al navegador) */}
      <section className="rounded-2xl border border-line bg-surface p-4 shadow-card">
        <div className="flex items-center gap-2">
          <Icon name="shield" size={18} className={persisted ? 'text-ok' : 'text-warn'} />
          <h2 className="text-base">
            {persisted === null
              ? MESSAGES.loading
              : persisted
                ? MESSAGES.storagePersisted
                : MESSAGES.storageNotPersisted}
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Los expedientes se guardan solo en este teléfono. Haz respaldos con frecuencia.
        </p>
        {usage != null && (
          <p className="tabular mt-2 text-xs text-muted">
            Uso: {formatBytes(usage)} de {formatBytes(quota)}
          </p>
        )}
      </section>

      {/* Marcador: la lista de pacientes llega en la Fase 1 */}
      <section className="rounded-2xl border border-dashed border-line bg-surface/60 p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon name="users" size={24} />
        </div>
        <h2 className="text-base">{NAV.patients}</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          {MESSAGES.noPatients}
        </p>
        <button
          type="button"
          disabled
          className="tap mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-ink opacity-60"
        >
          <Icon name="plus" size={18} stroke={2.4} />
          {ACTIONS.newPatient}
        </button>
        <p className="mt-3 text-xs text-muted">Disponible en la siguiente fase.</p>
      </section>
    </div>
  );
}
