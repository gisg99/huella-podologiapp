// Campos de formulario con etiqueta, pensados para móvil.
import { useId } from 'react';

const baseInput =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none';

function Label({ htmlFor, children, hint }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
      {children}
      {hint && <span className="ml-1 font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function TextField({ label, hint, className = '', id, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} hint={hint}>
          {label}
        </Label>
      )}
      <input id={fieldId} className={baseInput} {...rest} />
    </div>
  );
}

export function TextArea({ label, hint, className = '', rows = 3, id, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} hint={hint}>
          {label}
        </Label>
      )}
      <textarea id={fieldId} rows={rows} className={`${baseInput} resize-y`} {...rest} />
    </div>
  );
}

export function SelectField({ label, hint, className = '', children, id, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} hint={hint}>
          {label}
        </Label>
      )}
      <select id={fieldId} className={`${baseInput} appearance-none pr-10`} {...rest}>
        {children}
      </select>
    </div>
  );
}
