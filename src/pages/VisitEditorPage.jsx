import { useParams } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import VisitEditor from '../features/visits/VisitEditor.jsx';
import { useVisitDraft } from '../features/visits/useVisitDraft.js';
import { MESSAGES } from '../constants/text.js';

export default function VisitEditorPage() {
  const { id, visitId } = useParams();
  const { state, visit, patient, previousClinical } = useVisitDraft(id, visitId);

  if (state === 'loading') {
    return (
      <div>
        <AppHeader title="Visita" back />
        <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
      </div>
    );
  }
  if (state === 'notfound') {
    return (
      <div>
        <AppHeader title="Visita" back />
        <p className="py-10 text-center text-sm text-muted">No se encontró la visita.</p>
      </div>
    );
  }

  // key por visita: reinicia el estado del editor si cambia la visita.
  return <VisitEditor key={visit.id} visit={visit} patient={patient} previousClinical={previousClinical} />;
}
