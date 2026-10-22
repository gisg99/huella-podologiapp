// Definición de los campos que se comparan entre dos visitas. Cada `get`
// devuelve un texto listo para mostrar ('' = sin dato). Reutiliza las
// etiquetas es-MX de text.js.
import {
  FOOT_TYPES,
  SKIN_STATES,
  PULSE_STATES,
  DISORDERS as DISORDER_LABELS,
  NAIL_DISORDERS as NAIL_LABELS,
  FIELDS,
  FOOT_SIDES_SHORT,
} from '../../constants/text.js';

const SIDE_SUFFIX = { right: 'Der.', left: 'Izq.', both: 'Ambos' };

function toNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}
function itb(ankle, arm) {
  const a = toNum(ankle);
  const b = toNum(arm);
  return a != null && b ? (a / b).toFixed(2) : '';
}
function sideVal(obj, side, labels) {
  const k = obj?.[side];
  return k ? labels[k] : '';
}
function presentList(data, labels) {
  if (!data) return '';
  return Object.entries(data)
    .filter(([, x]) => x?.value === 'yes')
    .map(([k, x]) => labels[k] + (x.side && x.side !== 'none' ? ` (${SIDE_SUFFIX[x.side]})` : ''))
    .join(', ');
}
function sensSummary(s) {
  if (!s) return '';
  const arr = [...(s.right || []), ...(s.left || [])];
  const evaluated = arr.filter((x) => x && x !== 'notEvaluated');
  if (!evaluated.length) return '';
  return `${arr.filter((x) => x === 'sensitive').length}/${arr.length}`;
}

export const COMPARE_SECTIONS = [
  {
    key: 'visit',
    items: [
      { label: FIELDS.reason, get: (v) => v.reason || '' },
      { label: 'Glucosa (HGT)', get: (v) => (v.vitals?.hgt ? `${v.vitals.hgt} mg/dL` : '') },
      { label: 'Dolor (EVA)', get: (v) => (v.vitals?.eva ? `${v.vitals.eva}/10` : '') },
      { label: FIELDS.weight, get: (v) => (v.weight ? `${v.weight} kg` : '') },
      {
        label: 'Presión arterial',
        get: (v) =>
          v.vitals?.bpSystolic && v.vitals?.bpDiastolic
            ? `${v.vitals.bpSystolic}/${v.vitals.bpDiastolic} mmHg`
            : '',
      },
    ],
  },
  {
    key: 'footExam',
    items: [
      { label: FIELDS.footType, get: (v) => (v.footType ? FOOT_TYPES[v.footType] : '') },
      { label: `${FIELDS.skin} (${FOOT_SIDES_SHORT.right})`, get: (v) => sideVal(v.footExam?.skin, 'right', SKIN_STATES) },
      { label: `${FIELDS.skin} (${FOOT_SIDES_SHORT.left})`, get: (v) => sideVal(v.footExam?.skin, 'left', SKIN_STATES) },
      { label: `${FIELDS.pediousPulse} (${FOOT_SIDES_SHORT.right})`, get: (v) => sideVal(v.footExam?.pediousPulse, 'right', PULSE_STATES) },
      { label: `${FIELDS.pediousPulse} (${FOOT_SIDES_SHORT.left})`, get: (v) => sideVal(v.footExam?.pediousPulse, 'left', PULSE_STATES) },
      { label: `ITB (${FOOT_SIDES_SHORT.right})`, get: (v) => itb(v.abi?.ankleSystolic?.right, v.abi?.armSystolic?.right) },
      { label: `ITB (${FOOT_SIDES_SHORT.left})`, get: (v) => itb(v.abi?.ankleSystolic?.left, v.abi?.armSystolic?.left) },
    ],
  },
  {
    key: 'disordersNails',
    items: [
      { label: FIELDS.disorders, get: (v) => presentList(v.disorders, DISORDER_LABELS) },
      { label: FIELDS.nailDisorders, get: (v) => presentList(v.nailDisorders, NAIL_LABELS) },
    ],
  },
  {
    key: 'lesionsSensitivity',
    items: [
      { label: FIELDS.lesionMap, get: (v) => (Array.isArray(v.lesionMarks) ? String(v.lesionMarks.length) : '') },
      { label: FIELDS.sensitivityTest, get: (v) => sensSummary(v.sensitivity) },
    ],
  },
];
