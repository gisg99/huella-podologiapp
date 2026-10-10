import { useTheme } from '../app/theme.jsx';
import Icon from './Icon.jsx';

const LABEL = { light: 'Claro', dark: 'Oscuro', system: 'Sistema' };

// Alterna sistema → claro → oscuro.
export default function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const key = theme ?? 'system';
  return (
    <button
      type="button"
      onClick={cycle}
      className="tap inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm font-semibold text-ink"
      aria-label={`Tema: ${LABEL[key]}. Cambiar.`}
    >
      <Icon name={key === 'dark' ? 'moon' : key === 'light' ? 'sun' : 'settings'} size={16} />
      <span>{LABEL[key]}</span>
    </button>
  );
}
