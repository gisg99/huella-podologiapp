import { usePwaUpdate } from '../app/usePwaUpdate.js';
import Icon from './Icon.jsx';
import { APP } from '../constants/text.js';

// Aviso no intrusivo de actualización disponible.
export default function PwaUpdatePrompt() {
  const { needRefresh, update, dismiss } = usePwaUpdate();
  if (!needRefresh) return null;
  return (
    <div
      className="fixed inset-x-0 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-card"
      style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', left: 16, right: 16 }}
      role="status"
    >
      <Icon name="backup" size={20} className="text-primary" />
      <span className="flex-1 text-sm font-semibold">{APP.updateAvailable}</span>
      <button
        type="button"
        onClick={dismiss}
        className="tap rounded-lg px-2 text-sm text-muted"
      >
        Después
      </button>
      <button
        type="button"
        onClick={update}
        className="tap rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-ink"
      >
        {APP.updateNow}
      </button>
    </div>
  );
}
