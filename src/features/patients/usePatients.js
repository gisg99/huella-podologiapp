import { useLiveQuery } from 'dexie-react-hooks';
import { patientRepo } from '../../db/index.js';

// Lista en vivo de pacientes activos (ordenados por última visita).
export function usePatients() {
  return useLiveQuery(() => patientRepo.listActive(), []);
}

// Un paciente en vivo por id.
export function usePatient(id) {
  return useLiveQuery(() => (id ? patientRepo.getById(id) : undefined), [id]);
}
