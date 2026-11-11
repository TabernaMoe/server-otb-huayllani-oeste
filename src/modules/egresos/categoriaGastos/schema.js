import { reqString } from '../../../validators/funcionesZod.js';
import z from 'zod';
export const CategoriaGastoSchema = z.object({
  nombre_gasto: reqString({ label: 'Gasto' }),
  descripcion: reqString({ label: 'Descripcion' }),
});

export const CategoriaGastoUpdateSchema = CategoriaGastoSchema.partial();
