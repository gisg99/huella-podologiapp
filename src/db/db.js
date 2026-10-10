import Dexie from 'dexie';
import { SCHEMA_VERSION } from '../constants/domain.js';

// Base de datos local (IndexedDB) con esquema versionado.
// Las migraciones futuras se agregan como `db.version(N).stores({...}).upgrade(...)`
// SIN modificar las versiones anteriores.
export const db = new Dexie('huella');

db.version(1).stores({
  // Un único registro de perfil (id fijo = 'profile').
  specialistProfile: '&id',
  // Pacientes. searchName: nombre normalizado para búsqueda por prefijo/índice.
  patients: 'id, searchName, lastVisitAt, createdAt, updatedAt, deletedAt',
  // Visitas. Una por cita, ligada al paciente.
  visits: 'id, patientId, date, status, updatedAt, deletedAt',
  // Fotos clínicas como Blob, ligadas a la visita.
  photos: 'id, visitId',
  // Ajustes clave-valor (PIN, respaldo, tema, etc.).
  settings: '&key',
});

export { SCHEMA_VERSION };

/** Marca de tiempo ISO actual. */
export function stamp() {
  return new Date().toISOString();
}
