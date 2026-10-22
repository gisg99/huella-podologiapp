import { useMemo, useState } from 'react';
import { Card, GroupLabel } from '../../../components/ui/Card.jsx';
import SegmentedControl from '../../../components/ui/SegmentedControl.jsx';
import FootSvg from '../fields/FootSvg.jsx';
import { Shape, Swatch } from '../fields/LesionShape.jsx';
import { newId } from '../../../lib/id.js';
import { LESION_SYMBOLS, FOOT_VIEWS, FOOT_SIDES } from '../../../constants/domain.js';
import {
  LESION_SYMBOLS as LESION_LABELS,
  FOOT_VIEWS as VIEW_LABELS,
  FOOT_SIDES as SIDE_LABELS,
  FOOT_SIDES_SHORT,
  FOOT_MAP,
} from '../../../constants/text.js';

const LESION_BY_KEY = Object.fromEntries(LESION_SYMBOLS.map((l) => [l.key, l]));

export default function StepLesionMap({ form, prev, update }) {
  const [view, setView] = useState('plantar');
  const [lesion, setLesion] = useState(LESION_SYMBOLS[0].key);

  const marks = form.lesionMarks || [];
  const prevIds = useMemo(
    () => new Set((prev?.lesionMarks || []).map((m) => m.id)),
    [prev],
  );
  const hasPrev = Boolean(prev);

  const addMark = (side) => (coords) =>
    update({ lesionMarks: [...marks, { id: newId(), type: lesion, side, view, ...coords }] });
  const removeMark = (id) => update({ lesionMarks: marks.filter((m) => m.id !== id) });

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        value={view}
        onChange={setView}
        options={FOOT_VIEWS.map((v) => ({ value: v, label: VIEW_LABELS[v] }))}
      />

      <Card className="flex flex-col gap-3">
        <div className="flex gap-3">
          {FOOT_SIDES.map((side) => (
            <div key={side} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                {SIDE_LABELS[side]}
              </span>
              <FootSvg
                side={side}
                view={view}
                onPlace={addMark(side)}
                ariaLabel={`Pie ${SIDE_LABELS[side].toLowerCase()}, vista ${VIEW_LABELS[view].toLowerCase()}`}
              >
                {marks
                  .filter((m) => m.side === side && m.view === view)
                  .map((m) => {
                    const def = LESION_BY_KEY[m.type];
                    if (!def) return null;
                    return (
                      <g
                        key={m.id}
                        transform={`translate(${m.x},${m.y})`}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMark(m.id);
                        }}
                      >
                        <circle r={12} fill="transparent" />
                        {hasPrev && !prevIds.has(m.id) && (
                          <circle
                            r={11}
                            fill="none"
                            stroke="var(--color-accent)"
                            strokeWidth={1.5}
                            strokeDasharray="2 2"
                          />
                        )}
                        <Shape shape={def.shape} colorToken={def.colorToken} r={7} />
                      </g>
                    );
                  })}
              </FootSvg>
            </div>
          ))}
        </div>
        <p className="text-center text-xs leading-relaxed text-muted">
          <span className="font-semibold text-ink">{FOOT_MAP.lesionActive}: {LESION_LABELS[lesion]}</span>
          <br />
          {FOOT_MAP.lesionHint}
        </p>
      </Card>

      <div>
        <GroupLabel>{FOOT_MAP.legend}</GroupLabel>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {LESION_SYMBOLS.map((l) => {
            const selected = l.key === lesion;
            return (
              <button
                key={l.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setLesion(l.key)}
                className={`tap flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left ${
                  selected ? 'border-primary bg-primary-soft' : 'border-line bg-surface'
                }`}
              >
                <Swatch shape={l.shape} colorToken={l.colorToken} />
                <span className="min-w-0 text-[11.5px] font-semibold leading-tight text-ink">
                  {LESION_LABELS[l.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <GroupLabel>{FOOT_MAP.marksPlaced}</GroupLabel>
        <div className="mt-2 flex flex-col gap-1.5">
          {marks.length === 0 ? (
            <p className="py-1 text-center text-xs italic text-muted">{FOOT_MAP.noMarks}</p>
          ) : (
            marks.map((m) => {
              const def = LESION_BY_KEY[m.type];
              if (!def) return null;
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-sm"
                >
                  <Swatch shape={def.shape} colorToken={def.colorToken} size={18} />
                  <span className="text-ink">{LESION_LABELS[m.type]}</span>
                  <span className="ml-auto text-[10.5px] font-bold uppercase tracking-wide text-muted">
                    {FOOT_SIDES_SHORT[m.side]} · {VIEW_LABELS[m.view]}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
