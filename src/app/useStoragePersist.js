import { useEffect, useState } from 'react';
import { settingsRepo } from '../db/index.js';
import { SETTINGS_KEYS } from '../constants/domain.js';

// Pide persistencia al navegador para reducir el riesgo de que borre los datos
// (importante en iOS Safari) y reporta el estado y el uso de almacenamiento.
export function useStoragePersist() {
  const [state, setState] = useState({ persisted: null, usage: null, quota: null });

  useEffect(() => {
    let active = true;
    async function run() {
      let persisted = null;
      try {
        if (navigator.storage?.persisted) {
          persisted = await navigator.storage.persisted();
          if (!persisted && navigator.storage.persist) {
            persisted = await navigator.storage.persist();
          }
        }
      } catch {
        persisted = null;
      }
      let usage = null;
      let quota = null;
      try {
        if (navigator.storage?.estimate) {
          const est = await navigator.storage.estimate();
          usage = est.usage ?? null;
          quota = est.quota ?? null;
        }
      } catch {
        /* sin estimación disponible */
      }
      if (!active) return;
      setState({ persisted, usage, quota });
      if (persisted !== null) {
        settingsRepo.set(SETTINGS_KEYS.storagePersisted, persisted).catch(() => {});
      }
    }
    run();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
