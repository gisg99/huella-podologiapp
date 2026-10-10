import { createHashRouter, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import Home from '../pages/Home.jsx';
import Placeholder from '../pages/Placeholder.jsx';
import { NAV } from '../constants/text.js';

// HashRouter: simplifica el hosting estático y el offline (sin reglas de servidor).
export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'pacientes', element: <Placeholder title={NAV.patients} icon="users" phase="Fase 1" /> },
      { path: 'respaldo', element: <Placeholder title={NAV.backup} icon="backup" phase="Fase 7" /> },
      {
        path: 'ajustes',
        element: <Placeholder title={NAV.settings} icon="settings" phase="Fase 1" showThemeToggle />,
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
