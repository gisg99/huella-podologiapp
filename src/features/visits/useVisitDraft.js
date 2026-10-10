import { useEffect, useState } from 'react';
import { patientRepo, visitRepo } from '../../db/index.js';
import { buildPrefilledClinical, extractClinical } from './visitModel.js';

/**
 * Resuelve la visita a editar para un paciente:
 *  - si `visitId` viene en la ruta, carga esa visita;
 *  - si no, reanuda el borrador abierto o crea uno nuevo precargado desde la
 *    última visita finalizada.
 * Devuelve también el paciente y los campos clínicos de la visita anterior
 * (para resaltar los cambios).
 */
export function useVisitDraft(patientId, visitId) {
  const [state, setState] = useState('loading'); // loading | ready | notfound
  const [visit, setVisit] = useState(null);
  const [patient, setPatient] = useState(null);
  const [previousClinical, setPreviousClinical] = useState(undefined);

  useEffect(() => {
    let active = true;

    (async () => {
      if (active) setState('loading');
      const p = await patientRepo.getById(patientId);
      if (!active) return;
      if (!p) {
        setState('notfound');
        return;
      }
      setPatient(p);

      let target;
      if (visitId) {
        target = await visitRepo.getById(visitId);
        if (!target || target.deletedAt) {
          if (active) setState('notfound');
          return;
        }
      } else {
        target = await visitRepo.findDraft(patientId);
        if (!target) {
          const previous = await visitRepo.latestFinalized(patientId);
          const clinical = buildPrefilledClinical(previous);
          target = await visitRepo.create(patientId, clinical);
        }
      }
      if (!active) return;

      const previous = await visitRepo.latestFinalized(patientId, target.date);
      if (!active) return;

      setVisit(target);
      setPreviousClinical(previous ? extractClinical(previous) : undefined);
      setState('ready');
    })();

    return () => {
      active = false;
    };
  }, [patientId, visitId]);

  return { state, visit, patient, previousClinical };
}
