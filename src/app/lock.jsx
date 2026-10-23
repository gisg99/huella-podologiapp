/* eslint-disable react-refresh/only-export-components -- provider + hook de bloqueo */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { settingsRepo } from '../db/index.js';
import { AUTO_LOCK_MS } from '../constants/domain.js';

// Estado de bloqueo de la app. `unlocked` vive solo en memoria: al recargar,
// la app arranca bloqueada. `configured` indica si ya existe un PIN.
const LockCtx = createContext(null);

export function LockProvider({ children }) {
  // `undefined` mientras carga; luego boolean.
  const configured = useLiveQuery(() => settingsRepo.hasPin(), [], undefined);
  const [unlocked, setUnlocked] = useState(false);
  const hiddenAt = useRef(0);

  // Auto-bloqueo por inactividad y al volver tras estar oculto mucho tiempo.
  useEffect(() => {
    if (!configured || !unlocked) return undefined;
    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setUnlocked(false), AUTO_LOCK_MS);
    };
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
      } else if (hiddenAt.current && Date.now() - hiddenAt.current > AUTO_LOCK_MS) {
        setUnlocked(false);
      } else {
        arm();
      }
    };
    const activity = ['pointerdown', 'keydown', 'touchstart'];
    arm();
    activity.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(timer);
      activity.forEach((e) => window.removeEventListener(e, arm));
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [configured, unlocked]);

  const value = {
    configured,
    unlocked,
    unlock: () => setUnlocked(true),
    lock: () => setUnlocked(false),
  };
  return <LockCtx.Provider value={value}>{children}</LockCtx.Provider>;
}

export function useLock() {
  const ctx = useContext(LockCtx);
  if (!ctx) throw new Error('useLock debe usarse dentro de <LockProvider>');
  return ctx;
}
