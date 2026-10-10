// Modelo de la ficha de visita: valores por defecto, precarga desde la visita
// anterior y detección de cambios para el resaltado.
import {
  PODIATRIC_HISTORY,
  DISORDERS,
  NAIL_DISORDERS,
  ASEPSIS_ITEMS,
  DEBRIDEMENT_ITEMS,
  NON_PREFILLED_VISIT_FIELDS,
} from '../../constants/domain.js';

function sidePair() {
  return { right: null, left: null };
}

function fromKeys(keys, value) {
  return Object.fromEntries(keys.map((k) => [k, typeof value === 'function' ? value() : value]));
}

// Campos clínicos (sin id ni metadatos) con sus valores vacíos.
export function emptyClinical() {
  return {
    weight: '',
    allergies: '',
    medications: '',
    reason: '',
    vitals: {
      temperature: '',
      respiratoryRate: '',
      heartRate: '',
      bpSystolic: '',
      bpDiastolic: '',
      satO2: '',
      hgt: '',
      eva: '',
    },
    diseases: [],
    otherDiseases: '',
    podiatricHistory: fromKeys(PODIATRIC_HISTORY, () => ({ present: false, note: '' })),
    toxicHabits: { alcohol: '', tobacco: '', drugs: '' },
    lifestyle: { activityLevel: null, footwearType: '', walkFrequency: '' },
    footType: null,
    footExam: {
      pediousPulse: sidePair(),
      tibialPulse: sidePair(),
      poplitealPulse: sidePair(),
      temperature: sidePair(),
      circulatoryProblems: sidePair(),
      skin: sidePair(),
    },
    abi: {
      armSystolic: { right: '', left: '' },
      ankleSystolic: { right: '', left: '' },
    },
    disorders: fromKeys(DISORDERS, () => ({ value: null, side: 'none' })),
    disordersOther: '',
    nailDisorders: fromKeys(NAIL_DISORDERS, () => ({ value: null, side: 'none' })),
    nailDisordersOther: '',
    lesionMarks: [], // Fase 3
    sensitivity: null, // Fase 3
    treatment: {
      asepsis: fromKeys(ASEPSIS_ITEMS, false),
      debridement: fromKeys(DEBRIDEMENT_ITEMS, false),
      observations: '',
    },
    indications: '',
  };
}

export const CLINICAL_KEYS = Object.keys(emptyClinical());

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

/** Extrae solo los campos clínicos de un registro de visita. */
export function extractClinical(visit) {
  const out = {};
  for (const k of CLINICAL_KEYS) {
    if (visit && k in visit) out[k] = clone(visit[k]);
  }
  return out;
}

/**
 * Construye los campos clínicos de una visita nueva precargando los de la visita
 * anterior, excepto los que deben capturarse de cero (fecha, signos vitales,
 * motivo, fotos, tratamiento, indicaciones).
 */
export function buildPrefilledClinical(previous) {
  const base = emptyClinical();
  if (!previous) return base;
  const prev = { ...base, ...extractClinical(previous) };
  // Reinicia los campos no precargables.
  const reset = {};
  if (NON_PREFILLED_VISIT_FIELDS.includes('vitals')) reset.vitals = base.vitals;
  if (NON_PREFILLED_VISIT_FIELDS.includes('reason')) reset.reason = '';
  if (NON_PREFILLED_VISIT_FIELDS.includes('treatment')) reset.treatment = base.treatment;
  if (NON_PREFILLED_VISIT_FIELDS.includes('indications')) reset.indications = '';
  return { ...prev, ...reset };
}

// ---- Comparación de cambios vs. visita anterior ----

export function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

function isEmptyValue(v) {
  if (v == null || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.values(v).every(isEmptyValue);
  return false;
}

/**
 * ¿El valor actual difiere del de la visita anterior?
 * No marca cuando el actual está vacío (evita ruido en campos aún sin llenar).
 */
export function isChanged(current, previous) {
  if (previous === undefined) return false; // no hay visita anterior
  if (isEmptyValue(current)) return false;
  return !deepEqual(current, previous);
}
