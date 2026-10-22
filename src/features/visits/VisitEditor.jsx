import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/Icon.jsx';
import Stepper from './Stepper.jsx';
import { emptyClinical, extractClinical } from './visitModel.js';
import { visitRepo, patientRepo } from '../../db/index.js';
import { alertKeysFromVisit } from '../../lib/alerts.js';
import { VISIT_STEPS } from '../../constants/domain.js';
import { ACTIONS, MESSAGES, VISIT_STATUS } from '../../constants/text.js';

import StepDataVitals from './steps/StepDataVitals.jsx';
import StepHistoryHabits from './steps/StepHistoryHabits.jsx';
import StepFootExam from './steps/StepFootExam.jsx';
import StepDisordersNails from './steps/StepDisordersNails.jsx';
import StepTreatment from './steps/StepTreatment.jsx';
import StepPhotosIndications from './steps/StepPhotosIndications.jsx';
import StepLesionMap from './steps/StepLesionMap.jsx';
import StepSensitivity from './steps/StepSensitivity.jsx';

const AUTOSAVE_MS = 600;

export default function VisitEditor({ visit, previousClinical, patient }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({ ...emptyClinical(), ...extractClinical(visit) }));
  const [date, setDate] = useState(visit.date);
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState('saved'); // saved | saving
  const [finalizing, setFinalizing] = useState(false);

  const latest = useRef({ form, date });
  const firstRun = useRef(true);
  const scrollRef = useRef(null);
  const scrollTop = () => scrollRef.current?.scrollTo({ top: 0 });

  // Mantiene la referencia a los últimos valores para el autoguardado y el flush.
  useEffect(() => {
    latest.current = { form, date };
  }, [form, date]);

  const update = (partial) => setForm((f) => ({ ...f, ...partial }));

  async function persist() {
    await visitRepo.update(visit.id, { ...latest.current.form, date: latest.current.date });
  }

  // Autoguardado con debounce en cada cambio.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    setSaveState('saving');
    const id = setTimeout(async () => {
      await persist();
      setSaveState('saved');
    }, AUTOSAVE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, date]);

  // Flush al desmontar (p. ej. salir o cerrar) para no perder cambios.
  useEffect(() => {
    return () => {
      persist();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFinalized = visit.status === 'finalized';
  const stepKey = VISIT_STEPS[step];
  const isLast = step === VISIT_STEPS.length - 1;

  function onDateChange(dayValue) {
    if (!dayValue) return;
    setDate(new Date(`${dayValue}T12:00:00`).toISOString());
  }

  async function goNext() {
    await persist();
    if (isLast) return;
    setStep((s) => Math.min(s + 1, VISIT_STEPS.length - 1));
    scrollTop();
  }

  function goPrev() {
    if (step === 0) {
      navigate(`/pacientes/${patient.id}`);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  }

  async function finalize() {
    setFinalizing(true);
    try {
      await persist();
      await visitRepo.finalize(visit.id);
      await patientRepo.update(patient.id, {
        alerts: alertKeysFromVisit({ ...latest.current.form }),
      });
      navigate(`/pacientes/${patient.id}`, { replace: true });
    } finally {
      setFinalizing(false);
    }
  }

  function renderStep() {
    const common = { form, prev: previousClinical, update };
    switch (stepKey) {
      case 'dataVitals':
        return <StepDataVitals {...common} date={date} onDateChange={onDateChange} />;
      case 'historyHabits':
        return <StepHistoryHabits {...common} />;
      case 'footExam':
        return <StepFootExam {...common} />;
      case 'disordersNails':
        return <StepDisordersNails {...common} />;
      case 'lesionMap':
        return <StepLesionMap {...common} />;
      case 'sensitivity':
        return <StepSensitivity {...common} />;
      case 'treatment':
        return <StepTreatment {...common} />;
      case 'photosIndications':
        return <StepPhotosIndications {...common} visit={visit} />;
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <AppHeader
        title={patient.fullName}
        subtitle={isFinalized ? VISIT_STATUS.finalized : VISIT_STATUS.draft}
        back
        onBack={goPrev}
        right={
          <span className="flex items-center gap-1 text-[11px] font-bold text-ok">
            {saveState === 'saving' ? (
              <span className="text-muted">Guardando…</span>
            ) : (
              <>
                <Icon name="check" size={13} stroke={3} /> {MESSAGES.draftSaved}
              </>
            )}
          </span>
        }
      />
      <div className="border-b border-line bg-surface">
        <Stepper index={step} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-6 pt-3">
        {renderStep()}
      </div>

      <div
        className="flex gap-3 border-t border-line bg-surface px-4 py-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <Button variant="ghost" onClick={goPrev} className="!flex-none !px-5">
          {step === 0 ? ACTIONS.back : 'Anterior'}
        </Button>
        {isLast ? (
          <Button variant="primary" full icon="check" onClick={finalize} disabled={finalizing}>
            {finalizing ? 'Finalizando…' : isFinalized ? ACTIONS.save : ACTIONS.finish}
          </Button>
        ) : (
          <Button variant="primary" full iconRight="chevron" onClick={goNext}>
            {ACTIONS.next}
          </Button>
        )}
      </div>
    </div>
  );
}
