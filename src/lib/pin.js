// Derivación y verificación del PIN de bloqueo.
// NUNCA se guarda el PIN: solo un hash PBKDF2 (SHA-256) + una sal aleatoria,
// ambos en base64. La verificación re-deriva con la misma sal y compara.

const ITERATIONS = 150000;
const KEY_BITS = 256;
const SALT_BYTES = 16;

function bytesToB64(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveBits(pin, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

/** Deriva el PIN. Con `saltB64` reutiliza esa sal; si no, genera una nueva. */
export async function hashPin(pin, saltB64) {
  const salt = saltB64 ? b64ToBytes(saltB64) : crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const bits = await deriveBits(pin, salt);
  return { hash: bytesToB64(bits), salt: bytesToB64(salt) };
}

/** Comparación en tiempo constante de dos cadenas base64. */
function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Verifica un PIN contra el hash+sal guardados. */
export async function verifyPin(pin, hashB64, saltB64) {
  if (!hashB64 || !saltB64) return false;
  const { hash } = await hashPin(pin, saltB64);
  return constantTimeEqual(hash, hashB64);
}
