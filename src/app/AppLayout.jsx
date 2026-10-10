import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import PwaUpdatePrompt from '../components/PwaUpdatePrompt.jsx';

// Estructura general: contenido desplazable + navegación inferior fija.
export default function AppLayout() {
  return (
    <div className="flex h-full flex-col bg-bg">
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <PwaUpdatePrompt />
      <BottomNav />
    </div>
  );
}
