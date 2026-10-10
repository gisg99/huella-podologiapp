import Icon from '../Icon.jsx';

const VARIANTS = {
  primary: 'bg-primary text-primary-ink border-transparent',
  ghost: 'bg-surface text-ink border-line',
  subtle: 'bg-surface-2 text-ink border-transparent',
  danger: 'bg-danger text-white border-transparent',
  dangerGhost: 'bg-surface text-danger border-danger',
};

// Botón táctil reutilizable. `icon` opcional (nombre del set de iconos).
export default function Button({
  children,
  variant = 'primary',
  icon,
  iconRight,
  className = '',
  full,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`tap inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-opacity active:opacity-80 disabled:opacity-50 ${
        VARIANTS[variant]
      } ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} stroke={2.3} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} stroke={2.3} />}
    </button>
  );
}
