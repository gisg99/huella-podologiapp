import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import { TextArea } from '../../../components/ui/Field.jsx';
import CheckChip from '../fields/CheckChip.jsx';
import { ASEPSIS_ITEMS, DEBRIDEMENT_ITEMS } from '../../../constants/domain.js';
import { TREATMENT, FIELDS } from '../../../constants/text.js';

export default function StepTreatment({ form, update }) {
  const t = form.treatment;
  const setAsepsis = (k, v) => update({ treatment: { ...t, asepsis: { ...t.asepsis, [k]: v } } });
  const setDebr = (k, v) => update({ treatment: { ...t, debridement: { ...t.debridement, [k]: v } } });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <GroupLabel>{TREATMENT.asepsis}</GroupLabel>
        <Card className="mt-2 grid grid-cols-1 gap-2">
          {ASEPSIS_ITEMS.map((k) => (
            <CheckChip key={k} label={TREATMENT[k]} checked={t.asepsis[k]} onChange={(v) => setAsepsis(k, v)} />
          ))}
        </Card>
      </div>

      <div>
        <GroupLabel>{TREATMENT.debridement}</GroupLabel>
        <Card className="mt-2 grid grid-cols-1 gap-2">
          {DEBRIDEMENT_ITEMS.map((k) => (
            <CheckChip key={k} label={TREATMENT[k]} checked={t.debridement[k]} onChange={(v) => setDebr(k, v)} />
          ))}
        </Card>
      </div>

      <div>
        <GroupLabel>{TREATMENT.observations}</GroupLabel>
        <Card className="mt-2">
          <TextArea
            rows={4}
            value={t.observations}
            onChange={(e) => update({ treatment: { ...t, observations: e.target.value } })}
            placeholder={`${FIELDS.treatment}…`}
          />
        </Card>
      </div>
    </div>
  );
}
