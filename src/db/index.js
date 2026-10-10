// Punto único de acceso a la capa de datos.
// La UI importa desde aquí; así la persistencia queda aislada y se puede
// agregar sincronización más adelante sin reescribir los componentes.
export { db, SCHEMA_VERSION, stamp } from './db.js';
export { settingsRepo } from './repositories/settingsRepo.js';
export { profileRepo } from './repositories/profileRepo.js';
export { patientRepo } from './repositories/patientRepo.js';
export { visitRepo } from './repositories/visitRepo.js';
export { photoRepo } from './repositories/photoRepo.js';
