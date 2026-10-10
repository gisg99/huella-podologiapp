import { useNavigate } from 'react-router-dom';
import Icon from '../Icon.jsx';

// Encabezado de pantalla, pegajoso, con botón de regreso opcional y acción.
export default function AppHeader({ title, subtitle, back, onBack, right }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));
  return (
    <header
      className="sticky z-10 flex items-center gap-2 border-b border-line bg-surface/95 px-3 py-3 backdrop-blur"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      {back && (
        <button
          type="button"
          onClick={handleBack}
          className="tap -ml-1 flex items-center justify-center rounded-lg text-muted"
          aria-label="Regresar"
        >
          <Icon name="back" size={22} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
