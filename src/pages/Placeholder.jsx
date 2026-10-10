import AppHeader from '../components/ui/AppHeader.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { MESSAGES } from '../constants/text.js';

// Pantalla provisional para secciones que se construyen en fases siguientes.
export default function Placeholder({ title, icon = 'foot', phase, showThemeToggle = false, back = false }) {
  return (
    <div>
      <AppHeader title={title} back={back} right={showThemeToggle ? <ThemeToggle /> : null} />
      <div className="px-4 pb-24 pt-6">
        <EmptyState icon={icon} title={MESSAGES.comingSoon}>
          {phase ? `Se construye en la ${phase}.` : null}
        </EmptyState>
      </div>
    </div>
  );
}
