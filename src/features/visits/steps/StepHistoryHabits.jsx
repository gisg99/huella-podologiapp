import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import { TextField } from '../../../components/ui/Field.jsx';
import SegmentedControl from '../../../components/ui/SegmentedControl.jsx';
import MultiChip from '../fields/MultiChip.jsx';
import CheckChip from '../fields/CheckChip.jsx';
import ChangeTag from '../fields/ChangeTag.jsx';
import { isChanged } from '../visitModel.js';
import { DISEASES, PODIATRIC_HISTORY, TOXIC_HABITS, ACTIVITY_LEVELS } from '../../../constants/domain.js';
import {
  DISEASES as DISEASE_LABELS,
  PODIATRIC_HISTORY as PH_LABELS,
  TOXIC_HABITS as TOX_LABELS,
  ACTIVITY_LEVELS as ACT_LABELS,
  FIELDS,
} from '../../../constants/text.js';

export default function StepHistoryHabits({ form, prev, update }) {
  const diseaseOptions = DISEASES.map((k) => ({ value: k, label: DISEASE_LABELS[k] }));
  const activityOptions = ACTIVITY_LEVELS.map((k) => ({ value: k, label: ACT_LABELS[k] }));

  const toggleDisease = (val) => {
    const set = new Set(form.diseases);
    set.has(val) ? set.delete(val) : set.add(val);
    update({ diseases: [...set] });
  };

  const setPH = (key, patch) => {
    const base = form.podiatricHistory || {};
    update({ podiatricHistory: { ...base, [key]: { ...base[key], ...patch } } });
  };

  const diseasesChanged = isChanged(form.diseases, prev?.diseases);
  const activityChanged = isChanged(form.lifestyle.activityLevel, prev?.lifestyle?.activityLevel);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <GroupLabel>{FIELDS.diseases}</GroupLabel>
        <Card className="mt-2 flex flex-col gap-3">
          {diseasesChanged && (
            <div>
              <ChangeTag />
            </div>
          )}
          <MultiChip options={diseaseOptions} selected={form.diseases} onToggle={toggleDisease} />
          <TextField
            label={FIELDS.otherDiseases}
            value={form.otherDiseases}
            onChange={(e) => update({ otherDiseases: e.target.value })}
          />
        </Card>
      </div>

      <div>
        <GroupLabel>{FIELDS.podiatricHistory}</GroupLabel>
        <Card className="mt-2 flex flex-col gap-2.5">
          {PODIATRIC_HISTORY.map((k) => {
            const item = form.podiatricHistory?.[k] || { present: false, note: '' };
            return (
              <div key={k}>
                <CheckChip
                  label={PH_LABELS[k]}
                  checked={item.present}
                  onChange={(v) => setPH(k, { present: v, note: v ? item.note : '' })}
                />
                {item.present && (
                  <TextField
                    className="mt-2"
                    placeholder={`${FIELDS.note} (opcional)`}
                    value={item.note}
                    onChange={(e) => setPH(k, { note: e.target.value })}
                  />
                )}
              </div>
            );
          })}
        </Card>
      </div>

      <div>
        <GroupLabel>{FIELDS.toxicHabits}</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          {TOXIC_HABITS.map((k) => (
            <TextField
              key={k}
              label={TOX_LABELS[k]}
              placeholder="Frecuencia, cantidad o “ninguno”"
              value={form.toxicHabits[k]}
              onChange={(e) => update({ toxicHabits: { ...form.toxicHabits, [k]: e.target.value } })}
            />
          ))}
        </Card>
      </div>

      <div>
        <GroupLabel>Estilo de vida</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">{FIELDS.activityLevel}</span>
              {activityChanged && <ChangeTag />}
            </div>
            <SegmentedControl
              value={form.lifestyle.activityLevel}
              onChange={(v) => update({ lifestyle: { ...form.lifestyle, activityLevel: v } })}
              options={activityOptions}
              columns={2}
            />
          </div>
          <TextField
            label={FIELDS.footwearType}
            value={form.lifestyle.footwearType}
            onChange={(e) => update({ lifestyle: { ...form.lifestyle, footwearType: e.target.value } })}
          />
          <TextField
            label={FIELDS.walkFrequency}
            placeholder="Ej. 30 minutos al día"
            value={form.lifestyle.walkFrequency}
            onChange={(e) => update({ lifestyle: { ...form.lifestyle, walkFrequency: e.target.value } })}
          />
        </Card>
      </div>
    </div>
  );
}
