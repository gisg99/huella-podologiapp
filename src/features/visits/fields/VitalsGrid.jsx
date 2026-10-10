import ChangeTag from './ChangeTag.jsx';
import { VITAL_SIGNS as VITAL_DEFS } from '../../../constants/domain.js';
import { VITAL_SIGNS as VITAL_LABELS } from '../../../constants/text.js';
import { isChanged } from '../visitModel.js';

const DEF = Object.fromEntries(VITAL_DEFS.map((d) => [d.key, d]));

function VitalCard({ keyName, vitals, prev, onChange }) {
  const def = DEF[keyName];
  const label = VITAL_LABELS[keyName];
  const val = vitals[keyName] ?? '';
  const prevVal = prev ? prev[keyName] : undefined;
  const changed = val !== '' && isChanged(String(val), prevVal != null ? String(prevVal) : undefined);
  return (
    <div className={`rounded-xl border bg-surface p-2.5 ${changed ? 'border-accent' : 'border-line'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wide ${changed ? 'text-accent' : 'text-muted'}`}>
          {label.short}
        </span>
        {changed && prevVal != null && prevVal !== '' && <ChangeTag>{prevVal}</ChangeTag>}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <input
          type="text"
          inputMode={def.inputMode}
          value={val}
          onChange={(e) => onChange({ ...vitals, [keyName]: e.target.value })}
          placeholder="—"
          className="tabular w-full min-w-0 bg-transparent text-lg font-bold text-ink outline-none placeholder:text-muted/50"
          aria-label={label.full}
        />
        <span className="text-[10px] font-semibold text-muted">{def.unit}</span>
      </div>
    </div>
  );
}

function PA({ vitals, prev, onChange }) {
  const changed =
    (vitals.bpSystolic !== '' && isChanged(String(vitals.bpSystolic), prev ? String(prev.bpSystolic ?? '') : undefined)) ||
    (vitals.bpDiastolic !== '' && isChanged(String(vitals.bpDiastolic), prev ? String(prev.bpDiastolic ?? '') : undefined));
  const prevPA = prev && (prev.bpSystolic || prev.bpDiastolic) ? `${prev.bpSystolic || '—'}/${prev.bpDiastolic || '—'}` : '';
  return (
    <div className={`rounded-xl border bg-surface p-2.5 ${changed ? 'border-accent' : 'border-line'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wide ${changed ? 'text-accent' : 'text-muted'}`}>PA</span>
        {changed && prevPA && <ChangeTag>{prevPA}</ChangeTag>}
      </div>
      <div className="mt-1 flex items-baseline gap-0.5">
        <input
          type="text"
          inputMode="numeric"
          value={vitals.bpSystolic}
          onChange={(e) => onChange({ ...vitals, bpSystolic: e.target.value })}
          placeholder="—"
          className="tabular w-full min-w-0 bg-transparent text-lg font-bold text-ink outline-none placeholder:text-muted/50"
          aria-label="Presión sistólica"
        />
        <span className="text-base font-bold text-muted">/</span>
        <input
          type="text"
          inputMode="numeric"
          value={vitals.bpDiastolic}
          onChange={(e) => onChange({ ...vitals, bpDiastolic: e.target.value })}
          placeholder="—"
          className="tabular w-full min-w-0 bg-transparent text-lg font-bold text-ink outline-none placeholder:text-muted/50"
          aria-label="Presión diastólica"
        />
      </div>
    </div>
  );
}

// Rejilla de signos vitales. `vitals` es el objeto actual, `prev` el anterior.
export default function VitalsGrid({ vitals, prev, onChange }) {
  const evaChanged =
    vitals.eva !== '' && isChanged(String(vitals.eva), prev?.eva != null ? String(prev.eva) : undefined);
  const evaNum = Number(vitals.eva === '' ? 0 : vitals.eva);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <VitalCard keyName="temperature" vitals={vitals} prev={prev} onChange={onChange} />
        <VitalCard keyName="heartRate" vitals={vitals} prev={prev} onChange={onChange} />
        <VitalCard keyName="respiratoryRate" vitals={vitals} prev={prev} onChange={onChange} />
        <VitalCard keyName="satO2" vitals={vitals} prev={prev} onChange={onChange} />
        <VitalCard keyName="hgt" vitals={vitals} prev={prev} onChange={onChange} />
        <PA vitals={vitals} prev={prev} onChange={onChange} />
      </div>

      {/* EVA con slider táctil grande */}
      <div className={`rounded-xl border bg-surface p-3 ${evaChanged ? 'border-accent' : 'border-line'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wide ${evaChanged ? 'text-accent' : 'text-muted'}`}>
            {VITAL_LABELS.eva.full}
          </span>
          <div className="flex items-center gap-2">
            {evaChanged && prev?.eva != null && prev.eva !== '' && <ChangeTag>{prev.eva}</ChangeTag>}
            <span className="font-display text-xl font-semibold text-ink">
              {vitals.eva === '' ? '—' : vitals.eva}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={evaNum}
          onChange={(e) => onChange({ ...vitals, eva: e.target.value })}
          className="mt-2 w-full accent-[var(--c-primary)]"
          aria-label={VITAL_LABELS.eva.full}
        />
        <div className="mt-0.5 flex justify-between text-[10px] text-muted">
          <span>0 · sin dolor</span>
          <span>10 · máximo</span>
        </div>
      </div>
    </div>
  );
}
