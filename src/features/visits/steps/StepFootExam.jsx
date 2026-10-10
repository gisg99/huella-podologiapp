import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import { TextField } from '../../../components/ui/Field.jsx';
import SideSelect from '../fields/SideSelect.jsx';
import FootTypeCards from '../fields/FootTypeCards.jsx';
import { isChanged } from '../visitModel.js';
import {
  PULSE_STATES,
  TEMPERATURE_STATES,
  SKIN_STATES,
  YES_NO as YES_NO_KEYS,
} from '../../../constants/domain.js';
import {
  PULSE_STATES as PULSE_L,
  TEMPERATURE_STATES as TEMP_L,
  SKIN_STATES as SKIN_L,
  YES_NO,
  FOOT_TYPES as FOOT_TYPE_LABELS,
  FOOT_SIDES_SHORT,
  FIELDS,
} from '../../../constants/text.js';

const opt = (keys, labels) => keys.map((k) => ({ value: k, label: labels[k] }));

const EXAM_ITEMS = [
  { key: 'pediousPulse', label: FIELDS.pediousPulse, options: opt(PULSE_STATES, PULSE_L) },
  { key: 'tibialPulse', label: FIELDS.tibialPulse, options: opt(PULSE_STATES, PULSE_L) },
  { key: 'poplitealPulse', label: FIELDS.poplitealPulse, options: opt(PULSE_STATES, PULSE_L) },
  { key: 'temperature', label: FIELDS.temperature, options: opt(TEMPERATURE_STATES, TEMP_L) },
  { key: 'circulatoryProblems', label: FIELDS.circulatoryProblems, options: opt(YES_NO_KEYS, YES_NO) },
  { key: 'skin', label: FIELDS.skin, options: opt(SKIN_STATES, SKIN_L) },
];

function abiIndex(ankle, arm) {
  const a = parseFloat(ankle);
  const b = parseFloat(arm);
  if (!a || !b) return '—';
  return (a / b).toFixed(2);
}

export default function StepFootExam({ form, prev, update }) {
  const setExam = (key, val) => update({ footExam: { ...form.footExam, [key]: val } });
  const setAbi = (group, side, value) =>
    update({ abi: { ...form.abi, [group]: { ...form.abi[group], [side]: value } } });

  const footTypeChanged = isChanged(form.footType, prev?.footType);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <GroupLabel>{FIELDS.footType}</GroupLabel>
        <div className="mt-2">
          <FootTypeCards
            value={form.footType}
            onChange={(v) => update({ footType: v })}
            changed={footTypeChanged}
            prevLabel={prev?.footType ? FOOT_TYPE_LABELS[prev.footType] : ''}
          />
        </div>
      </div>

      <div>
        <GroupLabel>{FIELDS.footExam}</GroupLabel>
        <div className="mt-2 flex flex-col gap-2.5">
          {EXAM_ITEMS.map((item) => {
            const cur = form.footExam[item.key] || {};
            const pv = prev?.footExam?.[item.key];
            const changed = {
              right: isChanged(cur.right, pv?.right),
              left: isChanged(cur.left, pv?.left),
            };
            return (
              <SideSelect
                key={item.key}
                label={item.label}
                options={item.options}
                value={cur}
                onChange={(val) => setExam(item.key, val)}
                changed={changed}
              />
            );
          })}
        </div>
      </div>

      <div>
        <GroupLabel>{FIELDS.ankleBrachialIndex}</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          <p className="text-xs text-muted">Presión sistólica (mmHg). El índice se calcula como tobillo ÷ brazo.</p>
          {['right', 'left'].map((side) => (
            <div key={side}>
              <p className="mb-2 text-sm font-semibold text-ink">Pie {FOOT_SIDES_SHORT[side].toLowerCase()}</p>
              <div className="grid grid-cols-3 items-end gap-3">
                <TextField
                  label={FIELDS.armSystolic}
                  inputMode="numeric"
                  value={form.abi.armSystolic[side]}
                  onChange={(e) => setAbi('armSystolic', side, e.target.value)}
                />
                <TextField
                  label={FIELDS.ankleSystolic}
                  inputMode="numeric"
                  value={form.abi.ankleSystolic[side]}
                  onChange={(e) => setAbi('ankleSystolic', side, e.target.value)}
                />
                <div className="rounded-xl border border-line bg-surface-2 px-3 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Índice</p>
                  <p className="tabular text-lg font-bold text-ink">
                    {abiIndex(form.abi.ankleSystolic[side], form.abi.armSystolic[side])}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
