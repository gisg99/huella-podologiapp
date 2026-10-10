import { useEffect, useMemo } from 'react';

// Crea un object URL para un Blob y lo revoca al cambiar/desmontar.
export function useObjectURL(blob) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => {
    if (!url) return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url]);
  return url;
}
