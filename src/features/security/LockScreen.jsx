import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { settingsRepo } from '../../db/index.js';
import { verifyPin } from '../../lib/pin.js';
import { useLock } from '../../app/lock.jsx';
import { BrandMark } from '../../components/Brand.jsx';
import { APP, SECURITY } from '../../constants/text.js';
import PinPad, { PinDots } from './PinPad.jsx';

const MAX = 4;

// Pantalla de bloqueo: pide el PIN y verifica contra el hash guardado.
export default function LockScreen() {
  const { unlock } = useLock();
  const stored = useLiveQuery(() => settingsRepo.getPin(), []);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  function handleDigit(d) {
    if (checking || !stored) return;
    const next = (pin + d).slice(0, MAX);
    setPin(next);
    if (next.length < MAX) return;
    setChecking(true);
    verifyPin(next, stored.hash, stored.salt).then((ok) => {
      if (ok) {
        unlock();
        return;
      }
      setError(true);
      navigator.vibrate?.(200);
      setTimeout(() => {
        setPin('');
        setError(false);
        setChecking(false);
      }, 550);
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
      <BrandMark size={48} />
      <div className="text-center">
        <p className="font-serif text-xl">{APP.name}</p>
        <p className="mt-1 text-sm text-muted">{SECURITY.lockTitle}</p>
      </div>
      <PinDots max={MAX} filled={pin.length} error={error} />
      <p className="h-4 text-sm font-bold text-danger">{error ? SECURITY.wrongPin : ''}</p>
      <PinPad
        pin={pin}
        max={MAX}
        disabled={checking}
        onDigit={handleDigit}
        onDelete={() => setPin((p) => p.slice(0, -1))}
      />
    </div>
  );
}
