import Z from 'zod';
import { reqString } from '../../validators/funcionesZod.js';

export const loginSchema = Z.object({
  nombre_usuario: reqString({ label: 'Nombre de usuario', min: 4 }),
  contrasenia_usuario: reqString({
    label: 'Contraseña',
    min: 4,
  }),
});
