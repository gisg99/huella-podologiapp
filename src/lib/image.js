// Compresión de imágenes en cliente con canvas. Todo local, sin red.
import { PHOTO_MAX_EDGE, PHOTO_JPEG_QUALITY } from '../constants/domain.js';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Comprime una imagen (File/Blob) redimensionando el lado mayor y recodificando
 * a JPEG. Devuelve un Blob. Pensado para fotos clínicas y el logotipo.
 */
export async function compressImage(
  input,
  { maxEdge = PHOTO_MAX_EDGE, quality = PHOTO_JPEG_QUALITY, mime = 'image/jpeg' } = {},
) {
  const url = URL.createObjectURL(input);
  try {
    const img = await loadImage(url);
    const { width, height } = img;
    const scale = Math.min(1, maxEdge / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (mime === 'image/jpeg') {
      // Fondo blanco para evitar transparencias negras al pasar a JPEG.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, mime, quality),
    );
    return blob ?? input;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Blob → data URL (base64). Para respaldos (Fase 7) y PDF. */
export function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** data URL → Blob. Para importar respaldos. */
export async function dataURLToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}
