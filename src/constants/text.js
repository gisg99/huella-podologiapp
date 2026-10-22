// Todas las etiquetas de interfaz y clínicas en español de México,
// centralizadas aquí. Indexadas por las claves de `domain.js`.

export const APP = {
  name: 'Huella',
  tagline: 'Expediente Podológico',
  offline: 'Funciona sin conexión',
  updateAvailable: 'Hay una actualización disponible',
  updateNow: 'Actualizar ahora',
};

export const NAV = {
  home: 'Inicio',
  patients: 'Pacientes',
  backup: 'Respaldo',
  settings: 'Ajustes',
};

export const ACTIONS = {
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  edit: 'Editar',
  back: 'Atrás',
  next: 'Siguiente',
  finish: 'Finalizar',
  add: 'Agregar',
  newPatient: 'Nuevo paciente',
  newVisit: 'Nueva visita',
  startFirstVisit: 'Iniciar primera consulta',
  exportPdf: 'Exportar PDF',
  search: 'Buscar paciente…',
  confirm: 'Confirmar',
  retry: 'Reintentar',
};

export const SEX = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
};

export const FOOT_TYPES = {
  egyptian: 'Egipcio',
  roman: 'Romano',
  greek: 'Griego',
  germanic: 'Germánico',
  celtic: 'Celta',
};

export const FOOT_SIDES = {
  right: 'Derecho',
  left: 'Izquierdo',
};

export const FOOT_SIDES_SHORT = {
  right: 'Der.',
  left: 'Izq.',
};

export const FOOT_VIEWS = {
  plantar: 'Plantar',
  dorsal: 'Dorsal',
};

export const ACTIVITY_LEVELS = {
  sedentary: 'Sedentario',
  light: 'Leve',
  moderate: 'Moderada',
  intense: 'Intensa',
};

export const PRESENCE = {
  none: 'Ninguno',
  right: 'Derecho',
  left: 'Izquierdo',
  both: 'Ambos',
};

export const YES_NO = {
  yes: 'Sí',
  no: 'No',
};

export const PULSE_STATES = {
  present: 'Presente',
  absent: 'Ausente',
};

export const TEMPERATURE_STATES = {
  cold: 'Fría',
  normal: 'Normal',
  warm: 'Caliente',
};

export const SKIN_STATES = {
  dry: 'Seca',
  normal: 'Normal',
  moist: 'Húmeda',
};

export const DISEASES = {
  dm: 'Diabetes mellitus (DM)',
  hta: 'Hipertensión arterial (HTA)',
  ca: 'Cáncer (CA)',
  vih: 'VIH',
  hemophilia: 'Hemofilia',
  vascular: 'Problemas vasculares',
};

// Abreviaturas para las alertas visibles en el expediente.
export const DISEASE_ALERTS = {
  dm: 'DM',
  hta: 'HTA',
  vascular: 'Vascular',
  anticoagulant: 'Anticoag.',
  allergy: 'Alergia',
};

export const PODIATRIC_HISTORY = {
  flatCavusFoot: 'Pie plano / pie cavo',
  priorOnychomycosis: 'Onicomicosis previa',
  priorPodiatricSurgery: 'Cirugías podológicas previas',
  lowerLimbTrauma: 'Traumatismos en miembros inferiores',
};

export const TOXIC_HABITS = {
  alcohol: 'Alcohol',
  tobacco: 'Tabaco',
  drugs: 'Drogas',
};

// Nombre corto (encabezado de tarjeta) y nombre completo del signo vital.
export const VITAL_SIGNS = {
  temperature: { short: 'T°', full: 'Temperatura' },
  respiratoryRate: { short: 'FR', full: 'Frecuencia respiratoria' },
  heartRate: { short: 'FC', full: 'Frecuencia cardiaca' },
  bpSystolic: { short: 'PA sistólica', full: 'Presión arterial sistólica' },
  bpDiastolic: { short: 'PA diastólica', full: 'Presión arterial diastólica' },
  satO2: { short: 'SatO₂', full: 'Saturación de oxígeno' },
  hgt: { short: 'HGT', full: 'Glucosa capilar' },
  eva: { short: 'EVA', full: 'Escala visual del dolor' },
};

export const DISORDERS = {
  bromhidrosis: 'Bromhidrosis',
  hyperhidrosis: 'Hiperhidrosis',
  anhidrosis: 'Anhidrosis',
  dryness: 'Resequedad',
  edema: 'Edema',
  varicoseVeins: 'Várices',
  dermatomycosis: 'Dermatomicosis',
  fovea: 'Fóvea',
  ulcers: 'Úlceras',
  keratoderma: 'Queratodermia',
  psoriasis: 'Psoriasis',
  hyperkeratosis: 'Hiperqueratosis',
  interdigitalMaceration: 'Maceración interdigital',
  plantarWarts: 'Verrugas plantares',
  eczemaDermatitis: 'Eccema o dermatitis',
  cracksFissures: 'Grietas o fisuras',
  wounds: 'Heridas',
};

export const NAIL_DISORDERS = {
  anonychia: 'Anoniquia',
  melanonychia: 'Melanoniquia',
  micronychia: 'Microniquia',
  melanoma: 'Melanoma',
  onychodystrophy: 'Onicodistrofia',
  onycholysis: 'Onicólisis',
  onychauxis: 'Onicauxis',
  onychocryptosis: 'Onicocriptosis',
  onychogryphosis: 'Onicogrifosis',
  onychophosis: 'Onicofosis',
  brachyonychia: 'Braquioniquia',
  beauLines: 'Líneas de Beau',
  longitudinalGrooves: 'Surcos longitudinales',
  pachyonychia: 'Paquioniquia',
  chloronychia: 'Cloroniquia',
  onychomycosis: 'Onicomicosis',
  nailPsoriasis: 'Psoriasis ungueal',
  pitting: 'Pitting',
  subungualHematoma: 'Hematoma subungueal',
};

export const LESION_SYMBOLS = {
  onychocryptosis: 'Onicocriptosis',
  subungualHematoma: 'Hematoma subungueal',
  ocherDermatitis: 'Dermatitis ocre',
  varicoseVeins: 'Várices',
  telangiectasias: 'Telangiectasias',
  hpv: 'VPH',
  pressureUlcer: 'Lesión por presión (LPP)',
  callus: 'Callosidad',
  heloma: 'Heloma',
  fibroma: 'Fibroma',
  granuloma: 'Granuloma',
  pyogenicGranuloma: 'Granuloma piógeno',
  paronychia: 'Paroniquia',
  wound: 'Herida',
  other: 'Otro',
};

export const SW_POINT_STATES = {
  sensitive: 'Sensible',
  notSensitive: 'No sensible',
  notEvaluated: 'No evaluado',
};

// Nombre anatómico de cada punto del Test de Semmes-Weinstein.
export const SW_POINTS = {
  hallux: 'Pulpejo 1.er dedo',
  toe3: 'Pulpejo 3.er dedo',
  toe5: 'Pulpejo 5.º dedo',
  mth1: '1.ª cabeza metatarsal',
  mth3: '3.ª cabeza metatarsal',
  mth5: '5.ª cabeza metatarsal',
  midMedial: 'Mediopié medial',
  midLateral: 'Mediopié lateral',
  heel: 'Talón',
};

// Fotos clínicas (Fase 5).
export const PHOTOS = {
  take: 'Tomar o elegir foto',
  processing: 'Procesando…',
  caption: 'Pie de foto',
  captionPlaceholder: 'Describe la foto (opcional)…',
  remove: 'Quitar',
  close: 'Cerrar',
  maxReached: 'Alcanzaste el máximo de fotos por visita.',
  hint: 'Se comprimen en tu teléfono y no salen de aquí.',
  deleteTitle: 'Eliminar foto',
  deleteMessage: 'Esta foto se borrará de la visita. No se puede deshacer.',
  addError: 'No se pudo agregar la foto.',
};

// Etiquetas de las métricas de evolución (Fase 4).
export const METRICS = {
  hgt: { label: 'Glucosa (HGT)', unit: 'mg/dL' },
  weight: { label: 'Peso', unit: 'kg' },
  eva: { label: 'Dolor (EVA)', unit: '/10' },
  sw: { label: 'Puntos sensibles', unit: '/18' },
  lesions: { label: 'Lesiones activas', unit: '' },
  bp: { label: 'Presión arterial', unit: 'mmHg', n1: 'Sistólica', n2: 'Diastólica' },
  itb: { label: 'Índice tobillo-brazo', unit: '', n1: 'Der.', n2: 'Izq.' },
};

export const EVOLUTION = {
  title: 'Evolución',
  open: 'Evolución',
  metrics: 'Métricas',
  vsPrev: 'vs. anterior',
  noData: 'Necesitas al menos una visita finalizada para ver la evolución.',
  oneVisit: 'Con una sola visita aún no hay tendencia; se dibuja al finalizar la siguiente.',
};

export const COMPARE = {
  title: 'Comparar visitas',
  open: 'Comparar',
  visitA: 'Visita A',
  visitB: 'Visita B',
  need2: 'Necesitas al menos dos visitas finalizadas para comparar.',
  samePick: 'Elige dos visitas distintas para comparar.',
  noChange: 'Sin cambios entre estas dos visitas.',
  changed: 'cambió',
  sections: {
    visit: 'Visita',
    footExam: 'Examen del pie',
    disordersNails: 'Trastornos y uñas',
    lesionsSensitivity: 'Lesiones y sensibilidad',
  },
};

// Instrucciones cortas de los dos pasos con mapa de pie.
export const FOOT_MAP = {
  lesionHint: 'Elige una lesión y toca el pie para marcarla. Toca una marca para quitarla.',
  lesionActive: 'Lesión activa',
  noMarks: 'Aún no hay marcas en esta vista.',
  marksPlaced: 'Marcas colocadas',
  legend: 'Leyenda',
  swHint: 'Toca un punto para ciclar su estado: Sensible → No sensible → No evaluado.',
  swPointsTitle: 'Puntos evaluados',
};

export const TREATMENT = {
  asepsis: 'Asepsia',
  debridement: 'Desbridación',
  observations: 'Observaciones',
  channelCleaning: 'Limpieza de canales',
  onychotomy: 'Onicotomía',
  despiculization: 'Despiculización',
  massage: 'Masaje',
  debulking: 'Desbastado',
  exfoliation: 'Exfoliación',
  other: 'Otros',
};

export const VISIT_STATUS = {
  draft: 'Borrador',
  finalized: 'Finalizada',
};

export const VISIT_STEPS = {
  dataVitals: 'Datos y signos vitales',
  historyHabits: 'Antecedentes y hábitos',
  footExam: 'Examen del pie',
  disordersNails: 'Trastornos y uñas',
  lesionMap: 'Mapa de lesiones',
  sensitivity: 'Sensibilidad',
  treatment: 'Tratamiento',
  photosIndications: 'Fotos e indicaciones',
};

// Secciones y campos de la historia clínica / ficha, para formularios y PDF.
export const FIELDS = {
  // Historia clínica
  fullName: 'Nombre completo',
  birthDate: 'Fecha de nacimiento',
  age: 'Edad',
  sex: 'Sexo',
  occupation: 'Ocupación',
  address: 'Domicilio',
  phone: 'Teléfono',
  emergencyContact: 'Contacto de emergencia',
  emergencyName: 'Nombre',
  emergencyRelationship: 'Parentesco',
  emergencyPhone: 'Teléfono',
  family: 'Antecedentes heredofamiliares',
  parents: 'Padres',
  siblings: 'Hermanos',
  children: 'Hijos',
  grandparents: 'Abuelos',
  admissionDate: 'Fecha de alta',
  // Visita
  visitDate: 'Fecha de atención',
  weight: 'Peso (kg)',
  allergies: 'Alergias',
  medications: 'Medicamentos y tratamiento actual',
  reason: 'Motivo de consulta',
  diseases: 'Enfermedades que padece',
  otherDiseases: 'Otras enfermedades',
  podiatricHistory: 'Antecedentes podológicos',
  toxicHabits: 'Toxicomanías',
  footwearType: 'Tipo de calzado habitual',
  walkFrequency: 'Frecuencia de caminata',
  activityLevel: 'Actividad física',
  footType: 'Tipo de pie',
  vitalSigns: 'Signos vitales',
  footExam: 'Examen del pie',
  pediousPulse: 'Pulso pedio',
  tibialPulse: 'Pulso tibial',
  poplitealPulse: 'Pulso poplíteo',
  temperature: 'Temperatura',
  circulatoryProblems: 'Problemas circulatorios',
  skin: 'Piel',
  disorders: 'Trastornos',
  nailDisorders: 'Alteraciones ungueales',
  other: 'Otros',
  lesionMap: 'Mapa de lesiones',
  sensitivityTest: 'Test de Semmes-Weinstein',
  ankleBrachialIndex: 'Índice tobillo-brazo',
  armSystolic: 'Presión sistólica de brazo',
  ankleSystolic: 'Presión sistólica de tobillo',
  treatment: 'Tratamiento',
  indications: 'Indicaciones',
  photos: 'Fotos clínicas',
  signature: 'Firma del profesional',
  note: 'Nota',
  caption: 'Pie de foto',
};

// Perfil del especialista
export const PROFILE = {
  title: 'Información del especialista',
  name: 'Nombre del especialista',
  license: 'Cédula profesional',
  specialty: 'Especialidad',
  specialtyDefault: 'Podólogo',
  clinic: 'Clínica o centro de salud',
  phone: 'Teléfono de contacto',
  email: 'Correo de contacto',
  logo: 'Logotipo',
  signature: 'Firma',
};

// Mensajes y estados varios
export const MESSAGES = {
  draftSaved: 'Borrador guardado',
  changedFromPrevious: 'Cambió desde la visita anterior',
  noPatients: 'Aún no hay pacientes. Agrega el primero para comenzar.',
  noVisits: 'Este paciente no tiene visitas registradas.',
  storagePersisted: 'Almacenamiento protegido',
  storageNotPersisted: 'Almacenamiento sin proteger',
  backupReminder: (days) => `Último respaldo hace ${days} días`,
  noBackupYet: 'Aún no has hecho un respaldo',
  confirmDelete: '¿Seguro que quieres eliminar esto? Se puede restaurar desde la papelera.',
  comingSoon: 'En construcción',
  loading: 'Cargando…',
};
