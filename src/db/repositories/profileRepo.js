import { db, stamp } from '../db.js';
import { PROFILE_ID } from '../../constants/domain.js';

// Perfil del especialista: un único registro con id fijo.
export const profileRepo = {
  // Devuelve `null` (no `undefined`) cuando aún no hay perfil, para que la UI
  // distinga "sin perfil" de "cargando" (undefined) y no se quede en el splash.
  async get() {
    return (await db.specialistProfile.get(PROFILE_ID)) ?? null;
  },

  async exists() {
    const p = await db.specialistProfile.get(PROFILE_ID);
    return !!p;
  },

  async save(data) {
    const existing = await db.specialistProfile.get(PROFILE_ID);
    const now = stamp();
    const record = {
      ...existing,
      ...data,
      id: PROFILE_ID,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await db.specialistProfile.put(record);
    return record;
  },
};
