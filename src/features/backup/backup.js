// Respaldo completo a un archivo JSON y restauración desde él.
// Todo es local: el archivo solo existe en el dispositivo del usuario.
// Las fotos (Blob) se incrustan en base64. Al restaurar se REEMPLAZAN los datos.

import { db, stamp } from '../../db/db.js';
import { SCHEMA_VERSION, SETTINGS_KEYS } from '../../constants/domain.js';

const BACKUP_TAG = 'huella';

// Ajustes que NO se exportan (específicos del dispositivo o sensibles al dispositivo).
const SETTINGS_EXCLUDE = new Set([
  SETTINGS_KEYS.pinHash,
  SETTINGS_KEYS.pinSalt,
  SETTINGS_KEYS.storagePersisted,
]);

function bytesToB64(bytes) {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

async function blobToData(blob) {
  const buf = await blob.arrayBuffer();
  return { type: blob.type || 'application/octet-stream', data: bytesToB64(new Uint8Array(buf)) };
}

function dataToBlob(type, data) {
  return new Blob([b64ToBytes(data)], { type: type || 'application/octet-stream' });
}

// Campos del perfil que guardan un Blob (logo, firma) y deben incrustarse.
const PROFILE_BLOB_FIELDS = ['logo', 'signature'];

async function encodeProfile(profile) {
  if (!profile || typeof profile !== 'object') return null;
  const out = { ...profile };
  for (const field of PROFILE_BLOB_FIELDS) {
    if (out[field] instanceof Blob) {
      out[field] = { __blob: await blobToData(out[field]) };
    }
  }
  return out;
}

function decodeProfile(profile) {
  if (!profile || typeof profile !== 'object') return null;
  const out = { ...profile };
  for (const field of PROFILE_BLOB_FIELDS) {
    const v = out[field];
    if (v && typeof v === 'object' && v.__blob) {
      out[field] = dataToBlob(v.__blob.type, v.__blob.data);
    } else if (v && typeof v === 'object' && !(v instanceof Blob)) {
      // Objeto que no es Blob ni envoltorio válido: lo descartamos para no romper la UI.
      out[field] = null;
    }
  }
  return out;
}

/** Construye el objeto de respaldo con todos los datos locales. */
export async function buildBackup() {
  const [profile, patients, visits, photos, settingsRows] = await Promise.all([
    db.specialistProfile.toArray(),
    db.patients.toArray(),
    db.visits.toArray(),
    db.photos.toArray(),
    db.settings.toArray(),
  ]);

  const photosOut = [];
  for (const p of photos) {
    const { blob, ...rest } = p;
    const enc = blob ? await blobToData(blob) : null;
    photosOut.push({ ...rest, type: enc?.type ?? null, data: enc?.data ?? null });
  }

  const settings = {};
  for (const row of settingsRows) {
    if (!SETTINGS_EXCLUDE.has(row.key)) settings[row.key] = row.value;
  }

  return {
    app: BACKUP_TAG,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: stamp(),
    counts: { patients: patients.length, visits: visits.length, photos: photos.length },
    data: {
      profile: await encodeProfile(profile[0] ?? null),
      patients,
      visits,
      photos: photosOut,
      settings,
    },
  };
}

/** Nombre de archivo sugerido, p. ej. `huella-respaldo-2026-10-22.json`. */
export function backupFilename(date = new Date()) {
  const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return `huella-respaldo-${iso}.json`;
}

/** Valida la forma mínima de un respaldo ya parseado. Lanza con código si no sirve. */
export function validateBackup(parsed) {
  if (!parsed || typeof parsed !== 'object' || parsed.app !== BACKUP_TAG || !parsed.data) {
    throw Object.assign(new Error('bad file'), { code: 'bad' });
  }
  if (typeof parsed.schemaVersion === 'number' && parsed.schemaVersion > SCHEMA_VERSION) {
    throw Object.assign(new Error('newer version'), { code: 'newer' });
  }
  return parsed;
}

/**
 * Restaura un respaldo REEMPLAZANDO los datos actuales. Tolera registros
 * parciales o corruptos (los omite y sigue). Preserva el PIN del dispositivo.
 * Devuelve conteos de lo efectivamente restaurado.
 */
export async function restoreBackup(parsed) {
  validateBackup(parsed);
  const data = parsed.data ?? {};
  const patients = Array.isArray(data.patients) ? data.patients : [];
  const visits = Array.isArray(data.visits) ? data.visits : [];
  const photosIn = Array.isArray(data.photos) ? data.photos : [];
  const settings = data.settings && typeof data.settings === 'object' ? data.settings : {};

  // Reconstruye los Blob de fotos fuera de la transacción.
  const photos = [];
  for (const p of photosIn) {
    if (!p || !p.id || !p.visitId) continue;
    try {
      const blob = p.data ? dataToBlob(p.type, p.data) : null;
      const rest = { ...p };
      delete rest.type;
      delete rest.data;
      photos.push({ ...rest, blob });
    } catch {
      /* foto corrupta: se omite */
    }
  }

  const result = { patients: 0, visits: 0, photos: 0 };

  await db.transaction(
    'rw',
    db.specialistProfile,
    db.patients,
    db.visits,
    db.photos,
    db.settings,
    async () => {
      // Reemplaza: vacía las tablas de datos clínicos.
      await Promise.all([db.patients.clear(), db.visits.clear(), db.photos.clear()]);

      if (patients.length) {
        await db.patients.bulkPut(patients.filter((p) => p && p.id)).catch(() => {});
        result.patients = patients.filter((p) => p && p.id).length;
      }
      if (visits.length) {
        await db.visits.bulkPut(visits.filter((v) => v && v.id)).catch(() => {});
        result.visits = visits.filter((v) => v && v.id).length;
      }
      if (photos.length) {
        await db.photos.bulkPut(photos).catch(() => {});
        result.photos = photos.length;
      }

      // Perfil: solo si el respaldo trae uno (decodifica logo/firma a Blob).
      if (data.profile && typeof data.profile === 'object') {
        const profile = decodeProfile(data.profile);
        await db.specialistProfile.put({ ...profile, id: 'profile' }).catch(() => {});
      }

      // Ajustes: no pisa el PIN ni el estado de almacenamiento del dispositivo.
      for (const [key, value] of Object.entries(settings)) {
        if (SETTINGS_EXCLUDE.has(key)) continue;
        await db.settings.put({ key, value, updatedAt: stamp() }).catch(() => {});
      }
    },
  );

  return result;
}
