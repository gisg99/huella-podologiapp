import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader.jsx';
import PatientForm from '../features/patients/PatientForm.jsx';
import { ACTIONS } from '../constants/text.js';

export default function PatientNew() {
  const navigate = useNavigate();
  return (
    <div>
      <AppHeader title={ACTIONS.newPatient} back />
      <div className="px-4 pb-24 pt-4">
        <PatientForm
          submitLabel="Guardar paciente"
          onSaved={(p) => navigate(`/pacientes/${p.id}`, { replace: true, state: { justCreated: true } })}
        />
      </div>
    </div>
  );
}
