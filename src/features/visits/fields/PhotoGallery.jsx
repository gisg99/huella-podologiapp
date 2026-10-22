import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card } from '../../../components/ui/Card.jsx';
import Icon from '../../../components/Icon.jsx';
import ConfirmDialog from '../../../components/ui/ConfirmDialog.jsx';
import { useObjectURL } from '../../../lib/useObjectURL.js';
import { compressImage } from '../../../lib/image.js';
import { photoRepo } from '../../../db/index.js';
import { MAX_PHOTOS_PER_VISIT } from '../../../constants/domain.js';
import { PHOTOS } from '../../../constants/text.js';

// Una foto: miniatura (abre el visor), pie de foto con autoguardado y eliminar.
function PhotoItem({ photo, onView, onDelete }) {
  const url = useObjectURL(photo.blob);
  const [caption, setCaption] = useState(photo.caption || '');
  const latest = useRef(photo.caption || '');
  const timer = useRef(null);

  function onChange(e) {
    const v = e.target.value;
    latest.current = v;
    setCaption(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => photoRepo.updateCaption(photo.id, v), 500);
  }

  // Guarda el pie de foto pendiente al desmontar (p. ej. al cambiar de paso).
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      photoRepo.updateCaption(photo.id, latest.current);
    },
    [photo.id],
  );

  return (
    <Card className="flex flex-col gap-2 !p-2">
      <button type="button" onClick={onView} className="block overflow-hidden rounded-lg" aria-label="Ver foto">
        {url && <img src={url} alt={caption || 'Foto clínica'} className="h-28 w-full object-cover" />}
      </button>
      <input
        value={caption}
        onChange={onChange}
        placeholder={PHOTOS.captionPlaceholder}
        aria-label={PHOTOS.caption}
        className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
      />
      <button
        type="button"
        onClick={onDelete}
        className="tap flex items-center justify-center gap-1 text-xs font-semibold text-danger"
      >
        <Icon name="trash" size={14} /> {PHOTOS.remove}
      </button>
    </Card>
  );
}

// Visor a pantalla completa (toca fuera o el botón para cerrar).
function Lightbox({ photo, onClose }) {
  const url = useObjectURL(photo.blob);
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
      style={{ paddingTop: 'env(safe-area-inset-top, 16px)', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {url && (
        <img
          src={url}
          alt={photo.caption || 'Foto clínica'}
          className="max-h-[78vh] max-w-full rounded-xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {photo.caption && <p className="mt-3 max-w-md text-center text-sm text-white/90">{photo.caption}</p>}
      <button type="button" onClick={onClose} className="tap mt-4 rounded-xl bg-white/15 px-5 py-2 text-sm font-bold text-white">
        {PHOTOS.close}
      </button>
    </div>
  );
}

export default function PhotoGallery({ visitId }) {
  const photos = useLiveQuery(() => (visitId ? photoRepo.listByVisit(visitId) : []), [visitId]);
  const list = (photos || []).slice().sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [viewing, setViewing] = useState(null);

  const full = list.length >= MAX_PHOTOS_PER_VISIT;

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const blob = await compressImage(file);
      await photoRepo.add(visitId, blob);
    } catch (err) {
      setError(err?.message || PHOTOS.addError);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (toDelete) {
      await photoRepo.delete(toDelete);
      setToDelete(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {list.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {list.map((p) => (
            <PhotoItem key={p.id} photo={p} onView={() => setViewing(p)} onDelete={() => setToDelete(p.id)} />
          ))}
        </div>
      )}

      {full ? (
        <p className="text-center text-xs text-muted">{PHOTOS.maxReached}</p>
      ) : (
        <>
          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="tap flex h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface text-muted disabled:opacity-60"
          >
            <Icon name={busy ? 'backup' : 'camera'} size={26} />
            <span className="text-sm font-semibold">{busy ? PHOTOS.processing : PHOTOS.take}</span>
          </button>
        </>
      )}

      <p className="text-xs text-muted">
        {PHOTOS.hint} · {list.length}/{MAX_PHOTOS_PER_VISIT}
      </p>
      {error && <p className="text-sm font-semibold text-danger">{error}</p>}

      <ConfirmDialog
        open={!!toDelete}
        title={PHOTOS.deleteTitle}
        message={PHOTOS.deleteMessage}
        confirmLabel="Eliminar"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
      {viewing && <Lightbox photo={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
