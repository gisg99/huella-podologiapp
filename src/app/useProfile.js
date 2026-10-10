import { useLiveQuery } from 'dexie-react-hooks';
import { profileRepo } from '../db/index.js';

// Perfil del especialista en vivo. `undefined` = cargando, `null`/registro = listo.
export function useProfile() {
  return useLiveQuery(() => profileRepo.get(), []);
}
