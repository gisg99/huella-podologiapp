// Constantes estructurales del dominio (claves en inglés).
// Las etiquetas en español viven en `text.js`, indexadas por estas claves.

// Versión del esquema de datos. Se usa en IndexedDB y para validar respaldos.
export const SCHEMA_VERSION = 1;

// Identificador fijo del único registro de perfil del especialista.
export const PROFILE_ID = 'profile';

// Protocolo de Semmes-Weinstein: puntos por pie (configurable).
// El podólogo confirmó 9 puntos por pie (18 en total).
export const SW_POINTS_PER_FOOT = 9;

export const SEX = ['male', 'female', 'other'];

export const FOOT_TYPES = ['egyptian', 'roman', 'greek', 'germanic', 'celtic'];

export const FOOT_SIDES = ['right', 'left'];

export const FOOT_VIEWS = ['plantar', 'dorsal'];

export const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'intense'];

// Valores de los selectores tri-estado reutilizables.
export const PRESENCE = ['none', 'right', 'left', 'both']; // lado afectado
export const YES_NO = ['yes', 'no'];

// Examen del pie (por lado).
export const PULSE_STATES = ['present', 'absent'];
export const TEMPERATURE_STATES = ['cold', 'normal', 'warm'];
export const SKIN_STATES = ['dry', 'normal', 'moist'];

// Enfermedades que padece (multi-selección) + "otros" en texto.
export const DISEASES = ['dm', 'hta', 'ca', 'vih', 'hemophilia', 'vascular'];

// Antecedentes podológicos (multi-selección, cada uno con nota opcional).
export const PODIATRIC_HISTORY = [
  'flatCavusFoot',
  'priorOnychomycosis',
  'priorPodiatricSurgery',
  'lowerLimbTrauma',
];

// Toxicomanías (texto libre por cada una).
export const TOXIC_HABITS = ['alcohol', 'tobacco', 'drugs'];

// Signos vitales. `slider` marca la EVA (0-10). Todos opcionales.
export const VITAL_SIGNS = [
  { key: 'temperature', unit: '°C', inputMode: 'decimal', min: 30, max: 45, step: 0.1 },
  { key: 'respiratoryRate', unit: 'rpm', inputMode: 'numeric', min: 0, max: 80, step: 1 },
  { key: 'heartRate', unit: 'lpm', inputMode: 'numeric', min: 0, max: 250, step: 1 },
  { key: 'bpSystolic', unit: 'mmHg', inputMode: 'numeric', min: 0, max: 300, step: 1 },
  { key: 'bpDiastolic', unit: 'mmHg', inputMode: 'numeric', min: 0, max: 200, step: 1 },
  { key: 'satO2', unit: '%', inputMode: 'numeric', min: 0, max: 100, step: 1 },
  { key: 'hgt', unit: 'mg/dL', inputMode: 'numeric', min: 0, max: 800, step: 1 },
  { key: 'eva', unit: '/10', inputMode: 'numeric', min: 0, max: 10, step: 1, slider: true },
];

// Trastornos (base Sí/No con lado opcional). "other" es texto libre.
export const DISORDERS = [
  'bromhidrosis',
  'hyperhidrosis',
  'anhidrosis',
  'dryness',
  'edema',
  'varicoseVeins',
  'dermatomycosis',
  'fovea',
  'ulcers',
  'keratoderma',
  'psoriasis',
  'hyperkeratosis',
  'interdigitalMaceration',
  'plantarWarts',
  'eczemaDermatitis',
  'cracksFissures',
  'wounds',
];

// Alteraciones ungueales (typos del Word corregidos a términos estándar).
// ONICOCAUSIXS → onychauxis · MICRONIQUIA → micronychia
export const NAIL_DISORDERS = [
  'anonychia',
  'melanonychia',
  'micronychia',
  'melanoma',
  'onychodystrophy',
  'onycholysis',
  'onychauxis',
  'onychocryptosis',
  'onychogryphosis',
  'onychophosis',
  'brachyonychia',
  'beauLines',
  'longitudinalGrooves',
  'pachyonychia',
  'chloronychia',
  'onychomycosis',
  'nailPsoriasis',
  'pitting',
  'subungualHematoma',
];

// Leyenda del mapa de lesiones. `shape` + `colorToken` permiten distinguir
// cada marca por forma y color, legible también en blanco y negro (PDF).
export const LESION_SYMBOLS = [
  { key: 'onychocryptosis', shape: 'triangle', colorToken: 'primary' },
  { key: 'subungualHematoma', shape: 'circle', colorToken: 'ink' },
  { key: 'ocherDermatitis', shape: 'square', colorToken: 'accent' },
  { key: 'varicoseVeins', shape: 'ring', colorToken: 'ink' },
  { key: 'telangiectasias', shape: 'cross', colorToken: 'danger' },
  { key: 'hpv', shape: 'plus', colorToken: 'ink' },
  { key: 'pressureUlcer', shape: 'diamond', colorToken: 'danger' },
  { key: 'callus', shape: 'square', colorToken: 'warn' },
  { key: 'heloma', shape: 'circle', colorToken: 'danger' },
  { key: 'fibroma', shape: 'triangleDown', colorToken: 'ink' },
  { key: 'granuloma', shape: 'circle', colorToken: 'accent' },
  { key: 'pyogenicGranuloma', shape: 'ring', colorToken: 'danger' },
  { key: 'paronychia', shape: 'diamond', colorToken: 'warn' },
  { key: 'wound', shape: 'cross', colorToken: 'ink' },
  { key: 'other', shape: 'plus', colorToken: 'muted' },
];

// Estados de cada punto del Test de Semmes-Weinstein.
export const SW_POINT_STATES = ['sensitive', 'notSensitive', 'notEvaluated'];

// Tratamiento.
export const ASEPSIS_ITEMS = ['channelCleaning', 'onychotomy', 'despiculization', 'massage'];
export const DEBRIDEMENT_ITEMS = ['debulking', 'exfoliation', 'other'];

export const VISIT_STATUS = ['draft', 'finalized'];

// Pasos del formulario de visita (orden del stepper).
export const VISIT_STEPS = [
  'dataVitals',
  'historyHabits',
  'footExam',
  'disordersNails',
  'lesionMap',
  'sensitivity',
  'treatment',
  'photosIndications',
];

// Campos que NO se precargan desde la visita anterior (se capturan de cero).
export const NON_PREFILLED_VISIT_FIELDS = [
  'date',
  'vitals',
  'reason',
  'photos',
  'treatment',
  'indications',
];

// Máximo de fotos clínicas por visita.
export const MAX_PHOTOS_PER_VISIT = 2;

// Compresión de fotos en cliente.
export const PHOTO_MAX_EDGE = 1280;
export const PHOTO_JPEG_QUALITY = 0.7;

// Recordatorio de respaldo por defecto (días).
export const DEFAULT_BACKUP_REMINDER_DAYS = 7;

// Inactividad para bloqueo automático con PIN (ms).
export const AUTO_LOCK_MS = 3 * 60 * 1000;

// Claves de la tabla settings (key-value).
export const SETTINGS_KEYS = {
  pinHash: 'pinHash',
  pinSalt: 'pinSalt',
  lastBackupAt: 'lastBackupAt',
  backupReminderDays: 'backupReminderDays',
  storagePersisted: 'storagePersisted',
  swPointsPerFoot: 'swPointsPerFoot',
  theme: 'theme',
};
