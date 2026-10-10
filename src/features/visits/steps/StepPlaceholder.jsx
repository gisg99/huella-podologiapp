import EmptyState from '../../../components/ui/EmptyState.jsx';

// Marcador para pasos que se construyen en la Fase 3 (mapa de lesiones, sensibilidad).
export default function StepPlaceholder({ icon = 'foot', title, phase = 'Fase 3' }) {
  return (
    <div className="pt-4">
      <EmptyState icon={icon} title={title}>
        Se construye en la {phase}.
      </EmptyState>
    </div>
  );
}
