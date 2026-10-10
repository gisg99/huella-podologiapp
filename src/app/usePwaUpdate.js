import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

// Registra el service worker y expone el estado de actualización.
// Con registerType 'autoUpdate', el nuevo SW se activa al recargar; mostramos
// un aviso no intrusivo para que el usuario recargue cuando quiera (sin
// interrumpir una captura en curso).
export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const updateRef = useRef(null);

  useEffect(() => {
    updateRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });
  }, []);

  function update() {
    if (updateRef.current) updateRef.current(true);
  }

  function dismiss() {
    setNeedRefresh(false);
    setOfflineReady(false);
  }

  return { needRefresh, offlineReady, update, dismiss };
}
