import { useState } from 'react';
import AppHeader from '../components/ui/AppHeader.jsx';
import { Card, GroupLabel } from '../components/ui/Card.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Icon from '../components/Icon.jsx';
import ProfileForm from '../features/profile/ProfileForm.jsx';
import { useProfile } from '../app/useProfile.js';
import { useStoragePersist } from '../app/useStoragePersist.js';
import { NAV, PROFILE, MESSAGES } from '../constants/text.js';

function formatBytes(n) {
  if (n == null) return '—';
  const mb = n / (1024 * 1024);
  return mb < 1 ? `${(n / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

export default function Settings() {
  const profile = useProfile();
  const { persisted, usage, quota } = useStoragePersist();
  const [savedAt, setSavedAt] = useState(0);

  return (
    <div>
      <AppHeader title={NAV.settings} right={<ThemeToggle />} />
      <div className="flex flex-col gap-5 px-4 pb-24 pt-4">
        <div>
          <GroupLabel>{PROFILE.title}</GroupLabel>
          <div className="mt-2">
            {profile !== undefined && (
              <ProfileForm initial={profile ?? undefined} onSaved={() => setSavedAt(Date.now())} />
            )}
          </div>
          {savedAt > 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-ok">
              <Icon name="check" size={16} stroke={3} /> Cambios guardados
            </p>
          )}
        </div>

        <div>
          <GroupLabel>Almacenamiento</GroupLabel>
          <Card className="mt-2">
            <div className="flex items-center gap-2">
              <Icon name="shield" size={18} className={persisted ? 'text-ok' : 'text-warn'} />
              <p className="text-sm font-semibold">
                {persisted === null
                  ? MESSAGES.loading
                  : persisted
                    ? MESSAGES.storagePersisted
                    : MESSAGES.storageNotPersisted}
              </p>
            </div>
            {usage != null && (
              <p className="tabular mt-2 text-xs text-muted">
                Uso: {formatBytes(usage)} de {formatBytes(quota)}
              </p>
            )}
          </Card>
        </div>

        <div>
          <GroupLabel>Seguridad</GroupLabel>
          <Card className="mt-2">
            <div className="flex items-center gap-2 text-muted">
              <Icon name="shield" size={18} />
              <p className="text-sm">PIN de bloqueo y respaldos: se configuran en la Fase 7.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
