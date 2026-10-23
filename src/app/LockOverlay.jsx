import { useProfile } from './useProfile.js';
import { useLock } from './lock.jsx';
import LockScreen from '../features/security/LockScreen.jsx';
import PinSetup from '../features/security/PinSetup.jsx';

// Capa que cubre toda la app cuando hay que crear el PIN o está bloqueada.
// Se monta por encima del router (z alto) para que los datos no sean visibles.
function Cover({ children }) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-bg"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="mx-auto h-full w-full max-w-md">{children}</div>
    </div>
  );
}

export default function LockOverlay() {
  const profile = useProfile();
  const { configured, unlocked, unlock } = useLock();

  // Cargando perfil o estado del PIN: no tapamos (el router muestra su splash).
  if (profile === undefined || configured === undefined) return null;
  // Sin perfil aún: primero el onboarding; no hay datos que proteger todavía.
  if (!profile) return null;
  // Perfil listo pero sin PIN: obligar a crearlo.
  if (!configured) {
    return (
      <Cover>
        <PinSetup mode="setup" onDone={unlock} />
      </Cover>
    );
  }
  // Con PIN configurado pero bloqueado: pedir el PIN.
  if (!unlocked) {
    return (
      <Cover>
        <LockScreen />
      </Cover>
    );
  }
  return null;
}
