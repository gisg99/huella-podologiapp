import { useState } from 'react';
import AppHeader from '../components/ui/AppHeader.jsx';
import { Card, GroupLabel } from '../components/ui/Card.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Icon from '../components/Icon.jsx';
import ProfileForm from '../features/profile/ProfileForm.jsx';
import { useProfile } from '../app/useProfile.js';
import { useStoragePersist } from '../app/useStoragePersist.js';
import PinSetup from '../features/security/PinSetup.jsx';
import Button from '../components/ui/Button.jsx';
import { NAV, PROFILE, MESSAGES, SECURITY } from '../constants/text.js';

function formatBytes(n) {
  if (n == null) return '—';
  const mb = n / (1024 * 1024);
  return mb < 1 ? `${(n / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

export default function Settings() {
  const profile = useProfile();
  const { persisted, usage, quota } = useStoragePersist();
  const [savedAt, setSavedAt] = useState(0);
  const [changingPin, setChangingPin] = useState(false);
  const [pinChanged, setPinChanged] = useState(false);

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
          <GroupLabel>{SECURITY.group}</GroupLabel>
          <Card className="mt-2">
            <div className="flex items-center gap-2">
              <Icon name="shield" size={18} className="text-ok" />
              <p className="flex-1 text-sm font-semibold">{SECURITY.pinActive}</p>
            </div>
            {pinChanged && (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-ok">
                <Icon name="check" size={16} stroke={3} /> {SECURITY.changed}
              </p>
            )}
            <div className="mt-3">
              <Button variant="ghost" onClick={() => setChangingPin(true)}>
                {SECURITY.changePin}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {changingPin && (
        <div
          className="fixed inset-0 z-[60] bg-bg"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="mx-auto h-full w-full max-w-md">
            <PinSetup
              mode="change"
              onDone={() => {
                setChangingPin(false);
                setPinChanged(true);
              }}
              onCancel={() => setChangingPin(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
