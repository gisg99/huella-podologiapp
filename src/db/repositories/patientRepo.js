import { db, stamp } from '../db.js';
import { newId } from '../../lib/id.js';
import { normalizeText, matchesSearch } from '../../lib/strings.js';

// Repositorio de pacientes (historia clínica general).
// Borrado lógico vía `deletedAt` (papelera), nunca borrado físico directo.
export const patientRepo = {
  getById(id) {
    return db.patients.get(id);
  },

  async create(data) {
    const now = stamp();
    const patient = {
      id: newId(),
      fullName: '',
      birthDate: null,
      sex: null,
      occupation: '',
      address: '',
      phone: '',
      emergencyContact: { name: '', relationship: '', phone: '' },
      family: { parents: '', siblings: '', children: '', grandparents: '' },
      admissionDate: now,
      ...data,
      searchName: normalizeText(data?.fullName ?? ''),
      lastVisitAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    await db.patients.add(patient);
    return patient;
  },

  async update(id, changes) {
    const patch = { ...changes, updatedAt: stamp() };
    if ('fullName' in changes) patch.searchName = normalizeText(changes.fullName);
    await db.patients.update(id, patch);
    return db.patients.get(id);
  },

  /** Actualiza la fecha de última visita (se llama al guardar una visita). */
  async touchLastVisit(id, dateIso) {
    const p = await db.patients.get(id);
    if (!p) return;
    if (!p.lastVisitAt || dateIso > p.lastVisitAt) {
      await db.patients.update(id, { lastVisitAt: dateIso, updatedAt: stamp() });
    }
  },

  /** Pacientes activos ordenados por última visita (más reciente primero). */
  async listActive() {
    const all = await db.patients.filter((p) => !p.deletedAt).toArray();
    return all.sort((a, b) => {
      const av = a.lastVisitAt || a.createdAt || '';
      const bv = b.lastVisitAt || b.createdAt || '';
      return bv.localeCompare(av);
    });
  },

  /** Búsqueda tolerante a acentos y mayúsculas sobre pacientes activos. */
  async search(query) {
    const active = await this.listActive();
    if (!query) return active;
    return active.filter((p) => matchesSearch(p.fullName, query));
  },

  listDeleted() {
    return db.patients.filter((p) => !!p.deletedAt).toArray();
  },

  async softDelete(id) {
    await db.patients.update(id, { deletedAt: stamp(), updatedAt: stamp() });
  },

  async restore(id) {
    await db.patients.update(id, { deletedAt: null, updatedAt: stamp() });
  },

  /** Borrado definitivo (papelera): elimina paciente, sus visitas y fotos. */
  async destroy(id) {
    await db.transaction('rw', db.patients, db.visits, db.photos, async () => {
      const visits = await db.visits.where('patientId').equals(id).toArray();
      const visitIds = visits.map((v) => v.id);
      if (visitIds.length) {
        await db.photos.where('visitId').anyOf(visitIds).delete();
        await db.visits.where('patientId').equals(id).delete();
      }
      await db.patients.delete(id);
    });
  },

  count() {
    return db.patients.filter((p) => !p.deletedAt).count();
  },
};
