import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import AppHeader from '../components/ui/AppHeader.jsx';
import { Card, GroupLabel } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/Icon.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { db, settingsRepo } from '../db/index.js';
import { buildBackup, backupFilename, validateBackup, restoreBackup } from '../features/backup/backup.js';
import { daysSince, formatDate } from '../lib/dates.js';
import { NAV, BACKUP } from '../constants/text.js';

function Counts({ data }) {
  const rows = [
    [BACKUP.patients, data?.patients],
    [BACKUP.visits, data?.visits],
    [BACKUP.photos, data?.photos],
  ];
  return (
    <div className="flex flex-col gap-1">
      {rows.map(([label, n]) => (
        <div key={label} className="flex items-center justify-between text-sm">
          <span className="text-muted">{label}</span>
          <span className="tabular font-bold">{n ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}

export default function Backup() {
  const fileRef = useRef(null);
  const [status, setStatus] = useState(null); // {kind:'ok'|'err', text}
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null); // respaldo parseado por restaurar

  const counts = useLiveQuery(async () => {
    const [patients, visits, photos] = await Promise.all([
      db.patients.count(),
      db.visits.count(),
      db.photos.count(),
    ]);
    return { patients, visits, photos };
  }, []);

  const lastBackupAt = useLiveQuery(() => settingsRepo.getLastBackupAt(), []);
  const backupDays = lastBackupAt ? daysSince(lastBackupAt) : null;

  async function handleExport() {
    setStatus(null);
    setBusy(true);
    try {
      const backup = await buildBackup();
      const json = JSON.stringify(backup);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backupFilename();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      await settingsRepo.setLastBackupAt();
      setStatus({ kind: 'ok', text: BACKUP.exportDone });
    } catch {
      setStatus({ kind: 'err', text: BACKUP.readError });
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite re-elegir el mismo archivo
    if (!file) return;
    setStatus(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      validateBackup(parsed);
      setPending(parsed);
    } catch (err) {
      const code = err?.code;
      setStatus({
        kind: 'err',
        text: code === 'newer' ? BACKUP.newerVersion : BACKUP.badFile,
      });
    }
  }

  async function confirmRestore() {
    if (!pending) return;
    setBusy(true);
    try {
      const res = await restoreBackup(pending);
      await settingsRepo.setLastBackupAt(pending.exportedAt ?? undefined);
      setStatus({ kind: 'ok', text: BACKUP.restoreDone(res.patients, res.visits) });
    } catch {
      setStatus({ kind: 'err', text: BACKUP.readError });
    } finally {
      setPending(null);
      setBusy(false);
    }
  }

  return (
    <div>
      <AppHeader title={NAV.backup} />
      <div className="flex flex-col gap-5 px-4 pb-24 pt-4">
        {/* Estado del último respaldo */}
        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
            lastBackupAt == null ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted'
          }`}
        >
          <Icon name={lastBackupAt == null ? 'alert' : 'backup'} size={18} className="flex-none" />
          <span>
            {lastBackupAt == null ? BACKUP.neverBackup : BACKUP.lastBackup(backupDays ?? 0)}
          </span>
        </div>

        {status && (
          <p
            className={`flex items-center gap-1.5 text-sm font-semibold ${
              status.kind === 'ok' ? 'text-ok' : 'text-danger'
            }`}
          >
            <Icon name={status.kind === 'ok' ? 'check' : 'alert'} size={16} stroke={2.6} />
            {status.text}
          </p>
        )}

        {/* Exportar */}
        <div>
          <GroupLabel>{BACKUP.exportGroup}</GroupLabel>
          <Card className="mt-2">
            <p className="mb-3 text-sm text-muted">{BACKUP.exportIntro}</p>
            <Counts data={counts} />
            <div className="mt-4">
              <Button full icon="backup" onClick={handleExport} disabled={busy}>
                {busy ? BACKUP.exporting : BACKUP.exportBtn}
              </Button>
            </div>
          </Card>
        </div>

        {/* Restaurar */}
        <div>
          <GroupLabel>{BACKUP.restoreGroup}</GroupLabel>
          <Card className="mt-2">
            <p className="mb-3 text-sm text-muted">{BACKUP.restoreIntro}</p>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFile}
              className="hidden"
            />
            <Button variant="ghost" full onClick={() => fileRef.current?.click()} disabled={busy}>
              {BACKUP.chooseFile}
            </Button>
          </Card>
        </div>

        <p className="px-1 text-xs text-muted">{BACKUP.localNote}</p>
      </div>

      <ConfirmDialog
        open={!!pending}
        title={BACKUP.restoreTitle}
        message={`${pending?.exportedAt ? BACKUP.fileSummary(formatDate(pending.exportedAt)) + '. ' : ''}${BACKUP.restoreWarning}`}
        confirmLabel={BACKUP.restoreConfirm}
        danger
        onConfirm={confirmRestore}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
