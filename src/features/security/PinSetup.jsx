import { useState } from 'react';
import { settingsRepo } from '../../db/index.js';
import { hashPin } from '../../lib/pin.js';
import Icon from '../../components/Icon.jsx';
import { ACTIONS, SECURITY } from '../../constants/text.js';
import PinPad, { PinDots } from './PinPad.jsx';

const MAX = 4;

/**
 * Captura y confirma un PIN nuevo, lo guarda (solo hash+sal) y avisa con onDone.
 * `mode='change'` muestra un botón de cancelar (la app ya está desbloqueada).
 */
export default function PinSetup({ mode = 'setup', onDone, onCancel }) {
  const [stage, setStage] = useState('enter'); // 'enter' | 'confirm'
  const [first, setFirst] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleDigit(d) {
    if (saving) return;
    const next = (pin + d).slice(0, MAX);
    setPin(next);
    if (next.length < MAX) return;

    if (stage === 'enter') {
      setFirst(next);
      setPin('');
      setStage('confirm');
      return;
    }
    // stage === 'confirm'
    if (next !== first) {
      setError(SECURITY.mismatch);
      navigator.vibrate?.(200);
      setTimeout(() => {
        setFirst('');
        setPin('');
        setStage('enter');
        setError('');
      }, 650);
      return;
    }
    setSaving(true);
    hashPin(next).then(async ({ hash, salt }) => {
      await settingsRepo.setPin(hash, salt);
      onDone?.();
    });
  }

  const title =
    stage === 'confirm'
      ? SECURITY.confirmTitle
      : mode === 'change'
        ? SECURITY.changeTitle
        : SECURITY.setupTitle;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
      <Icon name="shield" size={30} className="text-primary" />
      <div className="text-center">
        <p className="font-serif text-xl">{title}</p>
        <p className="mt-1 max-w-[30ch] text-sm text-muted">{SECURITY.setupHint}</p>
      </div>
      <PinDots max={MAX} filled={pin.length} error={!!error} />
      <p className="h-4 text-sm font-bold text-danger">{error}</p>
      <PinPad
        pin={pin}
        max={MAX}
        disabled={saving}
        onDigit={handleDigit}
        onDelete={() => setPin((p) => p.slice(0, -1))}
      />
      <p className="max-w-[28ch] text-center text-xs text-muted">{SECURITY.noRecovery}</p>
      {mode === 'change' && (
        <button
          type="button"
          onClick={onCancel}
          className="tap text-sm font-semibold text-muted active:opacity-60"
        >
          {ACTIONS.cancel}
        </button>
      )}
    </div>
  );
}
