import { useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import Icon from './Icon.jsx';
import { compressImage } from '../lib/image.js';
import { useObjectURL } from '../lib/useObjectURL.js';

// Selector de imagen con compresión en cliente. Devuelve un Blob vía onChange.
// `capture` activa la cámara trasera en móvil (para fotos clínicas).
export default function ImagePicker({
  value,
  onChange,
  label,
  hint,
  capture = false,
  maxEdge,
  quality,
  aspect = 'h-36',
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const url = useObjectURL(value);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;
    setBusy(true);
    try {
      const blob = await compressImage(file, { maxEdge, quality });
      onChange(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && (
        <p className="mb-1.5 text-sm font-semibold text-ink">
          {label}
          {hint && <span className="ml-1 font-normal text-muted">{hint}</span>}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        {...(capture ? { capture: 'environment' } : {})}
        onChange={handleFile}
        className="hidden"
      />
      {value && url ? (
        <div className="rounded-xl border border-line bg-surface-2 p-2">
          <img src={url} alt="" className={`mx-auto ${aspect} w-auto object-contain`} />
          <div className="mt-2 flex gap-2">
            <Button variant="ghost" icon="edit" onClick={() => inputRef.current?.click()}>
              Cambiar
            </Button>
            <Button variant="dangerGhost" onClick={() => onChange(null)}>
              Quitar
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`tap flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface ${aspect} text-muted`}
        >
          <Icon name={busy ? 'backup' : 'plus'} size={24} />
          <span className="text-sm font-semibold">
            {busy ? 'Procesando…' : 'Tocar para elegir imagen'}
          </span>
        </button>
      )}
    </div>
  );
}
