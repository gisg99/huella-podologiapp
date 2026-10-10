import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import PatientForm from '../features/patients/PatientForm.jsx';
import { usePatient } from '../features/patients/usePatients.js';
import { ACTIONS, MESSAGES } from '../constants/text.js';

export default function PatientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = usePatient(id);

  return (
    <div>
      <AppHeader title="Editar paciente" back />
      <div className="px-4 pb-24 pt-4">
        {patient === undefined ? (
          <p className="py-10 text-center text-sm text-muted">{MESSAGES.loading}</p>
        ) : !patient ? (
          <p className="py-10 text-center text-sm text-muted">Paciente no encontrado.</p>
        ) : (
          <PatientForm
            initial={patient}
            submitLabel={ACTIONS.save}
            onSaved={() => navigate(`/pacientes/${id}`, { replace: true })}
          />
        )}
      </div>
    </div>
  );
}
