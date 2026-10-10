import { db, stamp } from '../db.js';
import { newId } from '../../lib/id.js';
import { patientRepo } from './patientRepo.js';

// Repositorio de visitas (ficha podológica, una por cita).
export const visitRepo = {
  getById(id) {
    return db.visits.get(id);
  },

  async create(patientId, data = {}) {
    const now = stamp();
    const visit = {
      id: newId(),
      patientId,
      date: now,
      status: 'draft',
      ...data,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    await db.visits.add(visit);
    return visit;
  },

  async update(id, changes) {
    await db.visits.update(id, { ...changes, updatedAt: stamp() });
    return db.visits.get(id);
  },

  /** Marca la visita como finalizada y actualiza la última visita del paciente. */
  async finalize(id) {
    const visit = await db.visits.get(id);
    if (!visit) return null;
    await db.visits.update(id, { status: 'finalized', updatedAt: stamp() });
    await patientRepo.touchLastVisit(visit.patientId, visit.date);
    return db.visits.get(id);
  },

  /** Visitas activas de un paciente, más reciente primero. */
  async listByPatient(patientId) {
    const list = await db.visits
      .where('patientId')
      .equals(patientId)
      .filter((v) => !v.deletedAt)
      .toArray();
    return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  },

  /** Última visita finalizada anterior a `beforeDate` (para precarga y comparación). */
  async latestFinalized(patientId, beforeDate = null) {
    const list = await this.listByPatient(patientId);
    return (
      list.find(
        (v) => v.status === 'finalized' && (!beforeDate || (v.date || '') < beforeDate),
      ) ?? null
    );
  },

  /** Borrador abierto de un paciente, si existe. */
  async findDraft(patientId) {
    const list = await this.listByPatient(patientId);
    return list.find((v) => v.status === 'draft') ?? null;
  },

  async softDelete(id) {
    await db.visits.update(id, { deletedAt: stamp(), updatedAt: stamp() });
  },

  async restore(id) {
    await db.visits.update(id, { deletedAt: null, updatedAt: stamp() });
  },

  async destroy(id) {
    await db.transaction('rw', db.visits, db.photos, async () => {
      await db.photos.where('visitId').equals(id).delete();
      await db.visits.delete(id);
    });
  },
};
