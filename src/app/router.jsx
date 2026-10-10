/* eslint-disable react-refresh/only-export-components -- módulo de configuración del router */
import { createHashRouter, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import { useProfile } from './useProfile.js';
import { BrandMark } from '../components/Brand.jsx';
import Home from '../pages/Home.jsx';
import Patients from '../pages/Patients.jsx';
import PatientNew from '../pages/PatientNew.jsx';
import PatientEdit from '../pages/PatientEdit.jsx';
import PatientRecord from '../pages/PatientRecord.jsx';
import Settings from '../pages/Settings.jsx';
import Onboarding from '../pages/Onboarding.jsx';
import Placeholder from '../pages/Placeholder.jsx';
import { NAV } from '../constants/text.js';

function Splash() {
  return (
    <div className="flex h-full items-center justify-center">
      <BrandMark size={56} />
    </div>
  );
}

// Exige perfil del especialista; si no existe, lleva al onboarding.
function ProtectedLayout() {
  const profile = useProfile();
  if (profile === undefined) return <Splash />;
  if (!profile) return <Navigate to="/onboarding" replace />;
  return <AppLayout />;
}

// Onboarding solo si aún no hay perfil.
function OnboardingGate() {
  const profile = useProfile();
  if (profile === undefined) return <Splash />;
  if (profile) return <Navigate to="/" replace />;
  return <Onboarding />;
}

// HashRouter: simplifica el hosting estático y el offline (sin reglas de servidor).
export const router = createHashRouter([
  { path: '/onboarding', element: <OnboardingGate /> },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'pacientes', element: <Patients /> },
      { path: 'pacientes/nuevo', element: <PatientNew /> },
      { path: 'pacientes/:id', element: <PatientRecord /> },
      { path: 'pacientes/:id/editar', element: <PatientEdit /> },
      { path: 'pacientes/:id/visita', element: <Placeholder title="Visita" icon="foot" phase="Fase 2" back /> },
      { path: 'respaldo', element: <Placeholder title={NAV.backup} icon="backup" phase="Fase 7" /> },
      { path: 'ajustes', element: <Settings /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
