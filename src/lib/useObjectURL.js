/* eslint-disable react-hooks/set-state-in-effect --
   Este hook sincroniza un recurso externo (object URL) con el ciclo de vida de
   React: crear/revocar el URL en el mismo efecto es el patrón recomendado y lo
   hace seguro bajo StrictMode (doble montaje en desarrollo). El render extra es
   intencional. */
import { useEffect, useState } from 'react';

// Crea un object URL para un Blob y lo revoca al cambiar/desmontar.
export function useObjectURL(blob) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return undefined;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}
