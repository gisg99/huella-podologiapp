import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';
import { NAV } from '../constants/text.js';

const TABS = [
  { to: '/', icon: 'home', label: NAV.home, end: true },
  { to: '/pacientes', icon: 'users', label: NAV.patients },
  { to: '/respaldo', icon: 'backup', label: NAV.backup },
  { to: '/ajustes', icon: 'settings', label: NAV.settings },
];

// Navegación inferior, pensada para el pulgar. Blancos de toque ≥44px.
export default function BottomNav() {
  return (
    <nav
      className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-line bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Navegación principal"
    >
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `tap flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold ${
              isActive ? 'text-primary' : 'text-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={t.icon} size={22} stroke={isActive ? 2.3 : 2} />
              <span>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
