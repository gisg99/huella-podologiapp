import { db, stamp } from '../db.js';
import { SETTINGS_KEYS, DEFAULT_BACKUP_REMINDER_DAYS } from '../../constants/domain.js';

// Repositorio de ajustes clave-valor.
export const settingsRepo = {
  async get(key, fallback = null) {
    const row = await db.settings.get(key);
    return row ? row.value : fallback;
  },

  async set(key, value) {
    await db.settings.put({ key, value, updatedAt: stamp() });
    return value;
  },

  async getAll() {
    const rows = await db.settings.toArray();
    const out = {};
    for (const r of rows) out[r.key] = r.value;
    return out;
  },

  // Helpers de uso frecuente
  getLastBackupAt() {
    return this.get(SETTINGS_KEYS.lastBackupAt, null);
  },
  setLastBackupAt(iso = stamp()) {
    return this.set(SETTINGS_KEYS.lastBackupAt, iso);
  },
  async getBackupReminderDays() {
    return this.get(SETTINGS_KEYS.backupReminderDays, DEFAULT_BACKUP_REMINDER_DAYS);
  },
  getTheme() {
    return this.get(SETTINGS_KEYS.theme, null); // null = sistema
  },
  setTheme(theme) {
    return this.set(SETTINGS_KEYS.theme, theme);
  },

  // PIN de bloqueo (solo hash + sal; nunca el PIN en claro).
  async hasPin() {
    const hash = await this.get(SETTINGS_KEYS.pinHash, null);
    return !!hash;
  },
  async getPin() {
    const hash = await this.get(SETTINGS_KEYS.pinHash, null);
    const salt = await this.get(SETTINGS_KEYS.pinSalt, null);
    return hash && salt ? { hash, salt } : null;
  },
  async setPin(hash, salt) {
    await this.set(SETTINGS_KEYS.pinHash, hash);
    await this.set(SETTINGS_KEYS.pinSalt, salt);
  },
  async clearPin() {
    await db.settings.delete(SETTINGS_KEYS.pinHash);
    await db.settings.delete(SETTINGS_KEYS.pinSalt);
  },
};
