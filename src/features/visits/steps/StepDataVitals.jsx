import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import { TextField, TextArea } from '../../../components/ui/Field.jsx';
import VitalsGrid from '../fields/VitalsGrid.jsx';
import ChangeTag from '../fields/ChangeTag.jsx';
import { isChanged } from '../visitModel.js';
import { FIELDS } from '../../../constants/text.js';

export default function StepDataVitals({ form, prev, update, date, onDateChange }) {
  const dateValue = date ? date.slice(0, 10) : '';
  const weightChanged = isChanged(form.weight, prev?.weight) && form.weight !== '';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <GroupLabel>Datos de la consulta</GroupLabel>
        <Card className="mt-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              type="date"
              label={FIELDS.visitDate}
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
            />
            <TextField
              label={
                <span className="inline-flex items-center gap-2">
                  {FIELDS.weight}
                  {weightChanged && <ChangeTag>{prev?.weight}</ChangeTag>}
                </span>
              }
              inputMode="decimal"
              value={form.weight}
              onChange={(e) => update({ weight: e.target.value })}
            />
          </div>
          <TextField
            label={FIELDS.allergies}
            value={form.allergies}
            onChange={(e) => update({ allergies: e.target.value })}
            placeholder="Ninguna conocida"
          />
          <TextArea
            label={FIELDS.medications}
            rows={2}
            value={form.medications}
            onChange={(e) => update({ medications: e.target.value })}
          />
          <TextArea
            label={FIELDS.reason}
            rows={2}
            value={form.reason}
            onChange={(e) => update({ reason: e.target.value })}
          />
        </Card>
      </div>

      <div>
        <GroupLabel>{FIELDS.vitalSigns}</GroupLabel>
        <div className="mt-2">
          <VitalsGrid vitals={form.vitals} prev={prev?.vitals} onChange={(v) => update({ vitals: v })} />
        </div>
      </div>
    </div>
  );
}
