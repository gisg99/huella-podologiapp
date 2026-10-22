import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import FootSvg from '../features/visits/fields/FootSvg.jsx';
import { Shape, Swatch } from '../features/visits/fields/LesionShape.jsx';
import { mirrorX } from '../features/visits/fields/footGeometry.js';
import { usePatient } from '../features/patients/usePatients.js';
import { useProfile } from '../app/useProfile.js';
import { visitRepo, photoRepo } from '../db/index.js';
import { useObjectURL } from '../lib/useObjectURL.js';
import { deriveAlerts } from '../lib/alerts.js';
import { calcAge, formatDate } from '../lib/dates.js';
import {
  LESION_SYMBOLS,
  SW_POINTS,
  FOOT_SIDES,
  ASEPSIS_ITEMS,
  DEBRIDEMENT_ITEMS,
} from '../constants/domain.js';
import {
  PDF,
  FIELDS,
  SEX as SEX_L,
  FOOT_SIDES as SIDE_L,
  FOOT_SIDES_SHORT,
  FOOT_VIEWS as VIEW_L,
  PULSE_STATES as PULSE_L,
  TEMPERATURE_STATES as TEMP_L,
  SKIN_STATES as SKIN_L,
  YES_NO as YESNO_L,
  DISORDERS as DISORDER_L,
  NAIL_DISORDERS as NAIL_L,
  LESION_SYMBOLS as LESION_L,
  TREATMENT,
  MESSAGES,
} from '../constants/text.js';

const LESION_BY_KEY = Object.fromEntries(LESION_SYMBOLS.map((l) => [l.key, l]));
const SIDE_SUFFIX = { right: 'Der.', left: 'Izq.', both: 'Ambos' };
const SW_FILL = { sensitive: 'var(--color-ok)', notSensitive: 'var(--color-danger)', notEvaluated: 'var(--color-surface)' };
const SW_STROKE = { sensitive: 'var(--color-ok)', notSensitive: 'var(--color-danger)', notEvaluated: 'var(--color-line)' };

const EXAM_ROWS = [
  ['pediousPulse', FIELDS.pediousPulse, PULSE_L],
  ['tibialPulse', FIELDS.tibialPulse, PULSE_L],
  ['poplitealPulse', FIELDS.poplitealPulse, PULSE_L],
  ['temperature', FIELDS.temperature, TEMP_L],
  ['circulatoryProblems', FIELDS.circulatoryProblems, YESNO_L],
  ['skin', FIELDS.skin, SKIN_L],
];

function has(v) {
  return v != null && String(v).trim() !== '';
}
function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}
function itb(ankle, arm) {
  const a = num(ankle);
  const b = num(arm);
  return a != null && b ? (a / b).toFixed(2) : '—';
}
function presentList(data, labels, other) {
  const items = data
    ? Object.entries(data)
        .filter(([, x]) => x?.value === 'yes')
        .map(([k, x]) => labels[k] + (x.side && x.side !== 'none' ? ` (${SIDE_SUFFIX[x.side]})` : ''))
    : [];
  if (has(other)) items.push(other.trim());
  return items.join(', ');
}

function Section({ title, children, break: brk }) {
  return (
    <section className={`pdf-avoid-break mt-4 ${brk ? 'pdf-page-break' : ''}`}>
      <h3 className="mb-2 border-b border-line pb-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">{title}</h3>
      {children}
    </section>
  );
}

function KV({ k, v }) {
  if (!has(v)) return null;
  return (
    <div className="flex justify-between gap-3 border-b border-dotted border-line py-0.5 text-[12.5px]">
      <span className="text-muted">{k}</span>
      <span className="text-right font-semibold text-ink">{v}</span>
    </div>
  );
}

function DocHeader({ profile }) {
  const logoUrl = useObjectURL(profile?.logo || null);
  const clinic = profile?.clinic || 'Huella';
  const initials = clinic.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'H';
  return (
    <div className="flex items-start justify-between gap-5 border-b-2 border-ink pb-3.5">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img src={logoUrl} alt="" className="h-13 w-13 flex-none rounded-[10px] object-contain" style={{ height: 52, width: 52 }} />
        ) : (
          <div className="grid flex-none place-items-center rounded-[10px] bg-primary-soft font-display text-[22px] font-semibold text-primary" style={{ height: 52, width: 52 }}>
            {initials}
          </div>
        )}
        <div>
          <div className="font-display text-[18px] font-semibold leading-tight text-ink">{clinic}</div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">Expediente Podológico</div>
        </div>
      </div>
      <div className="text-right text-[11.5px] leading-relaxed text-muted">
        <b className="block text-[13px] text-ink">{profile?.name || '—'}</b>
        {has(profile?.license) && <>Cédula {profile.license}<br /></>}
        {has(profile?.phone) && <>Tel. {profile.phone}</>}
      </div>
    </div>
  );
}

function LesionFeet({ marks, view }) {
  return (
    <div className="flex justify-center gap-2">
      {FOOT_SIDES.map((side) => (
        <div key={side} style={{ width: 92 }}>
          <FootSvg side={side} view={view} ariaLabel={`Pie ${SIDE_L[side].toLowerCase()} ${VIEW_L[view].toLowerCase()}`}>
            {marks
              .filter((m) => m.side === side && m.view === view)
              .map((m) => {
                const def = LESION_BY_KEY[m.type];
                if (!def) return null;
                return (
                  <g key={m.id} transform={`translate(${m.x},${m.y})`}>
                    <Shape shape={def.shape} colorToken={def.colorToken} r={7} />
                  </g>
                );
              })}
          </FootSvg>
        </div>
      ))}
    </div>
  );
}

function SwFeet({ sensitivity }) {
  const sens = {
    right: sensitivity?.right || [],
    left: sensitivity?.left || [],
  };
  return (
    <div className="flex justify-center gap-2">
      {FOOT_SIDES.map((side) => (
        <div key={side} style={{ width: 92 }}>
          <FootSvg side={side} view="plantar" ariaLabel={`Sensibilidad pie ${SIDE_L[side].toLowerCase()}`}>
            {SW_POINTS.map((p, i) => {
              const st = sens[side][i] || 'notEvaluated';
              const x = mirrorX(p.x, side);
              return (
                <g key={p.key} transform={`translate(${x},${p.y})`}>
                  <circle r={9.5} fill={SW_FILL[st]} stroke={SW_STROKE[st]} strokeWidth={2} />
                  <text x={0} y={3} textAnchor="middle" fontSize={9} fontWeight={800} fill={st === 'notEvaluated' ? 'var(--color-muted)' : '#fff'} style={{ fontFamily: 'var(--font-sans)' }}>
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </FootSvg>
        </div>
      ))}
    </div>
  );
}

function VisitPhotos({ visitId }) {
  const photos = useLiveQuery(() => photoRepo.listByVisit(visitId), [visitId]);
  const list = photos || [];
  if (list.length === 0) return null;
  return (
    <Section title={PDF.photos}>
      <div className="grid grid-cols-2 gap-3">
        {list.map((p) => (
          <PhotoCard key={p.id} photo={p} />
        ))}
      </div>
    </Section>
  );
}
function PhotoCard({ photo }) {
  const url = useObjectURL(photo.blob);
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      {url && <img src={url} alt={photo.caption || ''} className="aspect-[4/3] w-full object-cover" />}
      {has(photo.caption) && <p className="border-t border-line px-2 py-1.5 text-[11px] text-muted">{photo.caption}</p>}
    </div>
  );
}

function VisitSection({ visit, break: brk }) {
  const lesionMarks = visit.lesionMarks || [];
  const lesionViews = ['plantar', 'dorsal'].filter(
    (view) => view === 'plantar' || lesionMarks.some((m) => m.view === view),
  );
  const usedLesions = [...new Set(lesionMarks.map((m) => m.type))].map((k) => LESION_BY_KEY[k]).filter(Boolean);

  const vitals = visit.vitals || {};
  const vitalCells = [
    has(visit.weight) && { l: FIELDS.weight.replace(' (kg)', ''), v: visit.weight, u: 'kg' },
    has(vitals.hgt) && { l: 'Glucosa', v: vitals.hgt, u: 'mg/dL' },
    has(vitals.bpSystolic) && has(vitals.bpDiastolic) && { l: 'PA', v: `${vitals.bpSystolic}/${vitals.bpDiastolic}`, u: 'mmHg' },
    has(vitals.heartRate) && { l: 'FC', v: vitals.heartRate, u: 'lpm' },
    has(vitals.satO2) && { l: 'SatO₂', v: vitals.satO2, u: '%' },
    has(vitals.eva) && { l: 'Dolor', v: vitals.eva, u: '/10' },
  ].filter(Boolean);

  const abi = visit.abi || {};
  const disorders = presentList(visit.disorders, DISORDER_L, visit.disordersOther);
  const nails = presentList(visit.nailDisorders, NAIL_L, visit.nailDisordersOther);

  const t = visit.treatment || {};
  const asep = ASEPSIS_ITEMS.filter((k) => t.asepsis?.[k]).map((k) => TREATMENT[k]).join(', ');
  const debr = DEBRIDEMENT_ITEMS.filter((k) => t.debridement?.[k]).map((k) => TREATMENT[k]).join(', ');

  const swCount = (() => {
    const arr = [...(visit.sensitivity?.right || []), ...(visit.sensitivity?.left || [])];
    const evaluated = arr.filter((x) => x && x !== 'notEvaluated');
    if (!evaluated.length) return null;
    return `${arr.filter((x) => x === 'sensitive').length}/${arr.length}`;
  })();

  return (
    <div className={brk ? 'pdf-page-break' : ''}>
      <h2 className="mt-5 font-display text-[20px] font-semibold text-ink">
        Visita <span className="font-sans text-[12px] font-semibold text-muted">— {formatDate(visit.date)}{has(visit.reason) ? ` · ${visit.reason}` : ''}</span>
      </h2>

      {vitalCells.length > 0 && (
        <Section title={PDF.vitals}>
          <div className="grid grid-cols-4 gap-2">
            {vitalCells.map((c, i) => (
              <div key={i} className="rounded-lg border border-line px-2 py-1.5 text-center">
                <div className="text-[9px] font-extrabold uppercase tracking-wide text-muted">{c.l}</div>
                <div className="tabular text-[16px] font-extrabold text-ink">
                  {c.v} <span className="text-[10px] font-semibold text-muted">{c.u}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={PDF.footExam}>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="border-b border-line px-2 py-1 text-left text-[10px] font-extrabold uppercase tracking-wide text-muted">Variable</th>
              <th className="border-b border-line px-2 py-1 text-center text-[10px] font-extrabold uppercase tracking-wide text-muted">{FOOT_SIDES_SHORT.right}</th>
              <th className="border-b border-line px-2 py-1 text-center text-[10px] font-extrabold uppercase tracking-wide text-muted">{FOOT_SIDES_SHORT.left}</th>
            </tr>
          </thead>
          <tbody>
            {EXAM_ROWS.map(([key, label, labels]) => {
              const cur = visit.footExam?.[key] || {};
              return (
                <tr key={key}>
                  <td className="border-b border-line px-2 py-1 text-ink">{label}</td>
                  <td className="border-b border-line px-2 py-1 text-center font-semibold text-ink">{cur.right ? labels[cur.right] : '—'}</td>
                  <td className="border-b border-line px-2 py-1 text-center font-semibold text-ink">{cur.left ? labels[cur.left] : '—'}</td>
                </tr>
              );
            })}
            <tr>
              <td className="border-b border-line px-2 py-1 text-ink">{FIELDS.ankleBrachialIndex}</td>
              <td className="border-b border-line px-2 py-1 text-center font-semibold text-ink">{itb(abi.ankleSystolic?.right, abi.armSystolic?.right)}</td>
              <td className="border-b border-line px-2 py-1 text-center font-semibold text-ink">{itb(abi.ankleSystolic?.left, abi.armSystolic?.left)}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title={PDF.feet}>
        <div className="grid grid-cols-2 gap-5">
          {lesionViews.map((view) => (
            <div key={view} className="text-center">
              <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-muted">
                {PDF.lesionMap} · {VIEW_L[view]}
              </div>
              <LesionFeet marks={lesionMarks} view={view} />
            </div>
          ))}
          <div className="text-center">
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-muted">
              {PDF.sensitivity}{swCount ? ` · ${swCount}` : ''}
            </div>
            <SwFeet sensitivity={visit.sensitivity} />
          </div>
        </div>
        {usedLesions.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {usedLesions.map((l) => (
              <span key={l.key} className="inline-flex items-center gap-1.5 text-[10.5px] text-ink">
                <Swatch shape={l.shape} colorToken={l.colorToken} size={14} /> {LESION_L[l.key]}
              </span>
            ))}
          </div>
        )}
      </Section>

      {(has(disorders) || has(nails)) && (
        <Section title={`${FIELDS.disorders} / ${FIELDS.nailDisorders}`}>
          {has(disorders) && <p className="text-[12.5px] leading-relaxed text-ink"><b>{FIELDS.disorders}:</b> {disorders}</p>}
          {has(nails) && <p className="text-[12.5px] leading-relaxed text-ink"><b>{FIELDS.nailDisorders}:</b> {nails}</p>}
        </Section>
      )}

      {(has(asep) || has(debr) || has(t.observations)) && (
        <Section title={PDF.treatment}>
          <p className="text-[12.5px] leading-relaxed text-ink">
            {has(asep) && <><b>{PDF.asepsis}:</b> {asep}. </>}
            {has(debr) && <><b>{PDF.debridement}:</b> {debr}. </>}
            {has(t.observations) && <><b>{PDF.observations}:</b> {t.observations}</>}
          </p>
        </Section>
      )}

      {has(visit.indications) && (
        <Section title={PDF.indications}>
          <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-ink">{visit.indications}</p>
        </Section>
      )}

      <VisitPhotos visitId={visit.id} />
    </div>
  );
}

function SignatureBlock({ profile }) {
  const sigUrl = useObjectURL(profile?.signature || null);
  return (
    <div className="pdf-avoid-break mt-7 flex justify-end">
      <div className="text-center">
        <div className="grid h-16 w-[200px] place-items-end justify-center">
          {sigUrl ? <img src={sigUrl} alt="" className="max-h-16 object-contain" /> : <span />}
        </div>
        <div className="w-[200px] border-t border-ink pt-1 text-[12.5px] font-bold text-ink">{profile?.name || '—'}</div>
        {has(profile?.license) && <div className="text-[11px] text-muted">Cédula profesional {profile.license}</div>}
      </div>
    </div>
  );
}

export default function PdfExport() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const visitParam = searchParams.get('visita');
  const patient = usePatient(id);
  const profile = useProfile();
  const visits = useLiveQuery(() => (id ? visitRepo.listByPatient(id) : []), [id]);

  const finalizedAsc = useMemo(
    () =>
      (visits || [])
        .filter((v) => v.status === 'finalized')
        .slice()
        .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    [visits],
  );

  const [scope, setScope] = useState(visitParam ? 'visit' : 'full');
  const [selVisit, setSelVisit] = useState(visitParam || null);

  if (patient === undefined || visits === undefined || profile === undefined) {
    return (
      <div>
        <AppHeader title={PDF.title} back />
        <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
      </div>
    );
  }

  const effVisitId = selVisit || finalizedAsc[finalizedAsc.length - 1]?.id;
  const shown =
    scope === 'visit'
      ? finalizedAsc.filter((v) => v.id === effVisitId)
      : finalizedAsc;
  const alerts = deriveAlerts(finalizedAsc[finalizedAsc.length - 1]);
  const age = calcAge(patient.birthDate);
  const today = formatDate(new Date());

  return (
    <div className="min-h-full bg-bg">
      <div className="no-print">
        <AppHeader title={PDF.title} subtitle={patient.fullName} back />
        {finalizedAsc.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-3">
            <div className="inline-flex overflow-hidden rounded-xl border border-line">
              {[
                ['full', PDF.scopeFull],
                ['visit', PDF.scopeVisit],
              ].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  aria-pressed={scope === val}
                  onClick={() => setScope(val)}
                  className={`px-4 py-2 text-sm font-bold ${scope === val ? 'bg-primary text-primary-ink' : 'bg-surface text-muted'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {scope === 'visit' && (
              <select
                value={effVisitId || ''}
                onChange={(e) => setSelVisit(e.target.value)}
                className="rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm font-semibold text-ink"
              >
                {[...finalizedAsc].reverse().map((v) => (
                  <option key={v.id} value={v.id}>
                    {formatDate(v.date)}
                  </option>
                ))}
              </select>
            )}
            <Button icon="pdf" onClick={() => window.print()} className="ml-auto">
              {PDF.print}
            </Button>
          </div>
        )}
      </div>

      {finalizedAsc.length === 0 ? (
        <div className="px-4 pt-6">
          <EmptyState icon="pdf">{PDF.noFinalized}</EmptyState>
        </div>
      ) : (
        <div className="px-4 py-6 print:p-0">
          <div
            className="pdf-sheet mx-auto max-w-[840px] rounded border border-line shadow-card"
            style={{ padding: '40px 44px' }}
          >
            <DocHeader profile={profile} />

            <Section title={PDF.patient}>
              <div className="grid grid-cols-2 gap-x-7 gap-y-0.5">
                <KV k={FIELDS.fullName} v={patient.fullName} />
                <KV k="Edad / Sexo" v={[age != null ? `${age} años` : null, patient.sex ? SEX_L[patient.sex] : null].filter(Boolean).join(' · ')} />
                <KV k={FIELDS.phone} v={patient.phone} />
                <KV k={FIELDS.occupation} v={patient.occupation} />
                <KV k={FIELDS.address} v={patient.address} />
                <KV k={FIELDS.admissionDate} v={formatDate(patient.admissionDate)} />
              </div>
              {alerts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {alerts.map((a) => (
                    <span
                      key={a.key}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        a.tone === 'danger' ? 'bg-danger-soft text-danger' : a.tone === 'accent' ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted'
                      }`}
                    >
                      {a.label}
                    </span>
                  ))}
                </div>
              )}
            </Section>

            {shown.map((v, i) => (
              <VisitSection key={v.id} visit={v} break={scope === 'full' && i > 0} />
            ))}

            <SignatureBlock profile={profile} />

            <div className="mt-4 flex justify-between border-t border-line pt-2 text-[9.5px] text-muted">
              <span>Huella · Expediente Podológico</span>
              <span>{PDF.generatedOn(today)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
