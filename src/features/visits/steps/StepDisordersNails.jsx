import { GroupLabel } from '../../../components/ui/Card.jsx';
import { TextField } from '../../../components/ui/Field.jsx';
import TriStateRow from '../fields/TriStateRow.jsx';
import { isChanged } from '../visitModel.js';
import { DISORDERS, NAIL_DISORDERS } from '../../../constants/domain.js';
import {
  DISORDERS as DISORDER_LABELS,
  NAIL_DISORDERS as NAIL_LABELS,
  FIELDS,
} from '../../../constants/text.js';

function Section({ keys, labels, data, prevData, otherValue, onItem, onOther, title }) {
  return (
    <div>
      <GroupLabel>{title}</GroupLabel>
      <div className="mt-2 flex flex-col gap-2">
        {keys.map((k) => (
          <TriStateRow
            key={k}
            label={labels[k]}
            value={data[k]}
            onChange={(val) => onItem(k, val)}
            changed={isChanged(data[k], prevData?.[k])}
          />
        ))}
        <TextField
          className="mt-1"
          label={FIELDS.other}
          value={otherValue}
          onChange={(e) => onOther(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function StepDisordersNails({ form, prev, update }) {
  return (
    <div className="flex flex-col gap-6">
      <Section
        title={FIELDS.disorders}
        keys={DISORDERS}
        labels={DISORDER_LABELS}
        data={form.disorders}
        prevData={prev?.disorders}
        otherValue={form.disordersOther}
        onItem={(k, val) => update({ disorders: { ...form.disorders, [k]: val } })}
        onOther={(v) => update({ disordersOther: v })}
      />
      <Section
        title={FIELDS.nailDisorders}
        keys={NAIL_DISORDERS}
        labels={NAIL_LABELS}
        data={form.nailDisorders}
        prevData={prev?.nailDisorders}
        otherValue={form.nailDisordersOther}
        onItem={(k, val) => update({ nailDisorders: { ...form.nailDisorders, [k]: val } })}
        onOther={(v) => update({ nailDisordersOther: v })}
      />
    </div>
  );
}
