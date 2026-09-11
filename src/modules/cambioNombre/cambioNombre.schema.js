import z from 'zod';
import {
  reqString,
  reqIntegerId,
  reqDecimal,
  reqEnum,
} from '../../validators/funcionesZod.js';

export const cambioNombreSchema = z.object({
  accion_id: reqIntegerId({ label: 'Accion' }),
  socio_nuevo_id: reqIntegerId({ label: 'Socio Nuevo' }),
  tipo: reqEnum({ label: 'tipo', values: ['FAMILIAR', 'AJENO'] }),
  observacion: reqString({
    label: 'Observacion',
  }),
  monto: reqDecimal(),
});
