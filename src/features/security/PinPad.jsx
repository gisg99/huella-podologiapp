import { SECURITY } from '../../constants/text.js';

// Puntos de progreso del PIN.
export function PinDots({ max = 4, filled = 0, error = false }) {
  return (
    <div className={`flex gap-3.5 ${error ? 'animate-shake' : ''}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
            error
              ? 'border-danger bg-danger'
              : i < filled
                ? 'border-primary bg-primary'
                : 'border-primary bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}

// Teclado numérico táctil (blancos ≥44px). Controlado por el componente padre.
export default function PinPad({ pin = '', max = 4, onDigit, onDelete, disabled = false }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return (
    <div className="grid w-full max-w-[220px] grid-cols-3 gap-3">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          disabled={disabled || pin.length >= max}
          onClick={() => onDigit?.(k)}
          className="tap grid aspect-square place-items-center rounded-full border border-line bg-surface text-2xl font-bold text-ink transition-transform active:scale-95 active:bg-surface-2 disabled:opacity-40"
        >
          {k}
        </button>
      ))}
      <span aria-hidden="true" />
      <button
        type="button"
        disabled={disabled || pin.length >= max}
        onClick={() => onDigit?.('0')}
        className="tap grid aspect-square place-items-center rounded-full border border-line bg-surface text-2xl font-bold text-ink transition-transform active:scale-95 active:bg-surface-2 disabled:opacity-40"
      >
        0
      </button>
      <button
        type="button"
        disabled={disabled || pin.length === 0}
        onClick={() => onDelete?.()}
        className="tap grid aspect-square place-items-center rounded-full text-sm font-bold text-muted transition-opacity active:opacity-60 disabled:opacity-30"
      >
        {SECURITY.deleteKey}
      </button>
    </div>
  );
}
