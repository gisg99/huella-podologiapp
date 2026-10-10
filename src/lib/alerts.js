import { DISEASE_ALERTS } from '../constants/text.js';

const NONE_RE = /^(no|ningun[ao]s?|sin|n\/?a|-)\b/i;
const ANTICOAGULANT_RE =
  /(anticoagul|warfarin|acenocumarol|sintrom|rivaroxab|apixab|dabigatr|edoxab|heparin|enoxaparin|clopidogrel|acenocoumarol)/i;

// Metadatos de cada alerta: etiqueta y tono visual.
export const ALERT_META = {
  dm: { label: DISEASE_ALERTS.dm, tone: 'danger' },
  hta: { label: DISEASE_ALERTS.hta, tone: 'neutral' },
  vascular: { label: DISEASE_ALERTS.vascular, tone: 'neutral' },
  allergy: { label: DISEASE_ALERTS.allergy, tone: 'accent' },
  anticoagulant: { label: DISEASE_ALERTS.anticoagulant, tone: 'danger' },
};

function hasText(value) {
  const v = (value ?? '').trim();
  return v.length > 0 && !NONE_RE.test(v);
}

/** Claves de alerta presentes en una visita. */
export function alertKeysFromVisit(visit) {
  if (!visit) return [];
  const keys = [];
  const diseases = visit.diseases || [];
  if (diseases.includes('dm')) keys.push('dm');
  if (diseases.includes('hta')) keys.push('hta');
  if (diseases.includes('vascular')) keys.push('vascular');
  if (hasText(visit.allergies)) keys.push('allergy');
  if (ANTICOAGULANT_RE.test(visit.medications || '')) keys.push('anticoagulant');
  return keys;
}

/** Claves → [{ key, label, tone }] para pintar insignias. */
export function alertsFromKeys(keys) {
  return (keys || []).filter((k) => ALERT_META[k]).map((k) => ({ key: k, ...ALERT_META[k] }));
}

/** Alertas visibles derivadas directamente de una visita. */
export function deriveAlerts(visit) {
  return alertsFromKeys(alertKeysFromVisit(visit));
}
