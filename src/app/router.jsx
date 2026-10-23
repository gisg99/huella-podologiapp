/* eslint-disable react-refresh/only-export-components -- módulo de configuración del router */
import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import { useProfile } from './useProfile.js';
import { BrandMark } from '../components/Brand.jsx';
import Home from '../pages/Home.jsx';
import Patients from '../pages/Patients.jsx';
import PatientNew from '../pages/PatientNew.jsx';
import PatientEdit from '../pages/PatientEdit.jsx';
import PatientRecord from '../pages/PatientRecord.jsx';
import Evolution from '../pages/Evolution.jsx';
import CompareVisits from '../pages/CompareVisits.jsx';
import PdfExport from '../pages/PdfExport.jsx';
import VisitEditorPage from '../pages/VisitEditorPage.jsx';
import Settings from '../pages/Settings.jsx';
import Backup from '../pages/Backup.jsx';
import Onboarding from '../pages/Onboarding.jsx';

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

// Igual que el anterior pero a pantalla completa (sin navegación inferior),
// para flujos enfocados como el editor de visita.
function ProtectedFull() {
  const profile = useProfile();
  if (profile === undefined) return <Splash />;
  if (!profile) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
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
    element: <ProtectedFull />,
    children: [
      { path: '/pacientes/:id/visita', element: <VisitEditorPage /> },
      { path: '/pacientes/:id/visita/:visitId', element: <VisitEditorPage /> },
      { path: '/pacientes/:id/pdf', element: <PdfExport /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'pacientes', element: <Patients /> },
      { path: 'pacientes/nuevo', element: <PatientNew /> },
      { path: 'pacientes/:id', element: <PatientRecord /> },
      { path: 'pacientes/:id/editar', element: <PatientEdit /> },
      { path: 'pacientes/:id/evolucion', element: <Evolution /> },
      { path: 'pacientes/:id/comparar', element: <CompareVisits /> },
      { path: 'respaldo', element: <Backup /> },
      { path: 'ajustes', element: <Settings /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
