import Icon from '../components/Icon.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { MESSAGES } from '../constants/text.js';

// Pantalla provisional para secciones que se construyen en fases siguientes.
export default function Placeholder({ title, icon = 'foot', phase, showThemeToggle = false }) {
  return (
    <div className="flex flex-col gap-5 px-4 pb-24 pt-5">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl">{title}</h1>
        {showThemeToggle && <ThemeToggle />}
      </header>
      <section className="rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon name={icon} size={24} />
        </div>
        <p className="text-base font-semibold">{MESSAGES.comingSoon}</p>
        {phase && <p className="mt-1 text-sm text-muted">Se construye en la {phase}.</p>}
      </section>
    </div>
  );
}
