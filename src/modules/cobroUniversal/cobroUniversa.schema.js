import z from 'zod';
import {
  reqIntegerId,
  reqString,
  reqDecimal,
} from '../../validators/funcionesZod.js';

export const CobroUniversalSchema = z.object({
  accion_id: reqIntegerId({ label: 'Accion' }),
  concepto: reqString({ label: 'Concepto' }),
  descripcion: reqString({ label: 'Descripcion' }),
  monto: reqDecimal({ label: 'Monto' }),
});

export const CobroUniversalUpdateSchema = CobroUniversalSchema.partial();
