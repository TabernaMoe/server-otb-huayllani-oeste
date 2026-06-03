import z from 'zod';
import { reqYear } from '../../validators/funcionesZod.js';

export const gestionSchema = z.object({
  anio: reqYear(),
});
