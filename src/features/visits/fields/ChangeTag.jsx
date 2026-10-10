import Icon from '../../../components/Icon.jsx';
import { MESSAGES } from '../../../constants/text.js';

// Marcador de "cambió respecto a la visita anterior" (acento arcilla).
// `children` es el valor anterior a mostrar (opcional).
export default function ChangeTag({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent"
      title={MESSAGES.changedFromPrevious}
    >
      <Icon name="chevron" size={9} stroke={3} className="-rotate-90" />
      {children != null && children !== '' ? <>antes: {children}</> : 'cambió'}
    </span>
  );
}
