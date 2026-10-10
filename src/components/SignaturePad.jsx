import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import { useObjectURL } from '../lib/useObjectURL.js';

// Pad de firma táctil. Dibuja trazos oscuros sobre fondo transparente
// (para superponer en el PDF blanco). Guarda un PNG (Blob) vía onChange.
export default function SignaturePad({ value, onChange, label = 'Firma' }) {
  const [editing, setEditing] = useState(!value);
  const previewUrl = useObjectURL(editing ? null : value);

  if (!editing && value) {
    return (
      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink">{label}</p>
        <div className="rounded-xl border border-line bg-white p-2">
          <img src={previewUrl} alt="Firma guardada" className="mx-auto h-24 object-contain" />
        </div>
        <div className="mt-2 flex gap-2">
          <Button variant="ghost" icon="edit" onClick={() => setEditing(true)}>
            Volver a firmar
          </Button>
          <Button
            variant="dangerGhost"
            onClick={() => {
              onChange(null);
              setEditing(true);
            }}
          >
            Quitar
          </Button>
        </div>
      </div>
    );
  }

  return <Pad label={label} onSave={onChange} onCancel={value ? () => setEditing(false) : null} />;
}

function Pad({ label, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#14302b';
  }, []);

  function pos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  function start(e) {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
  }
  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    dirty.current = true;
  }
  function end() {
    drawing.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dirty.current = false;
  }

  function save() {
    if (!dirty.current) {
      onSave(null);
      return;
    }
    canvasRef.current.toBlob((blob) => onSave(blob), 'image/png');
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-ink">
        {label} <span className="font-normal text-muted">· dibuja con el dedo</span>
      </p>
      <canvas
        ref={canvasRef}
        className="h-36 w-full touch-none rounded-xl border border-line bg-white"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <div className="mt-2 flex gap-2">
        <Button variant="ghost" onClick={clear}>
          Limpiar
        </Button>
        <Button variant="primary" icon="check" onClick={save}>
          Guardar firma
        </Button>
        {onCancel && (
          <Button variant="subtle" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}
