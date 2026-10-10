import { db, stamp } from '../db.js';
import { newId } from '../../lib/id.js';
import { MAX_PHOTOS_PER_VISIT } from '../../constants/domain.js';

// Repositorio de fotos clínicas (Blob en IndexedDB), ligadas a la visita.
export const photoRepo = {
  listByVisit(visitId) {
    return db.photos.where('visitId').equals(visitId).toArray();
  },

  countByVisit(visitId) {
    return db.photos.where('visitId').equals(visitId).count();
  },

  async add(visitId, blob, caption = '') {
    const count = await this.countByVisit(visitId);
    if (count >= MAX_PHOTOS_PER_VISIT) {
      throw new Error(`Máximo ${MAX_PHOTOS_PER_VISIT} fotos por visita`);
    }
    const now = stamp();
    const photo = { id: newId(), visitId, blob, caption, createdAt: now, updatedAt: now };
    await db.photos.add(photo);
    return photo;
  },

  async updateCaption(id, caption) {
    await db.photos.update(id, { caption, updatedAt: stamp() });
  },

  async replace(id, blob) {
    await db.photos.update(id, { blob, updatedAt: stamp() });
  },

  delete(id) {
    return db.photos.delete(id);
  },
};
