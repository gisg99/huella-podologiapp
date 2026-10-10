import { useNavigate } from 'react-router-dom';
import { BrandMark } from '../components/Brand.jsx';
import ProfileForm from '../features/profile/ProfileForm.jsx';
import { APP, PROFILE } from '../constants/text.js';

// Primera apertura: captura del perfil del especialista. Sin navegación inferior.
export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-bg">
      <div className="mx-auto w-full max-w-md px-4 pb-16 pt-8">
        <header className="mb-6 flex flex-col items-center text-center">
          <BrandMark size={56} />
          <h1 className="mt-3 text-3xl">{APP.name}</h1>
          <p className="mt-1 text-sm text-muted">{APP.tagline}</p>
          <p className="mt-4 max-w-xs text-sm text-muted">
            Antes de empezar, registra tus datos. Aparecerán en los expedientes y en el PDF.
            Podrás editarlos después en Ajustes.
          </p>
        </header>
        <h2 className="mb-3 text-lg">{PROFILE.title}</h2>
        <ProfileForm submitLabel="Guardar y comenzar" onSaved={() => navigate('/', { replace: true })} />
      </div>
    </div>
  );
}
