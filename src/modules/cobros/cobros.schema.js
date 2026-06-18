import z from 'zod';
import {
  reqIntegerId,
  reqArrayIntegerIds,
  reqDecimal,
  reqMetodoPago,
} from '../../validators/funcionesZod.js';

export const CobroSchema = z.object({
  socio_id: reqIntegerId('Socio'),
  monto: reqDecimal(),
  cobros: reqArrayIntegerIds({ label: 'Cobros', minItems: 1 }),
  metodo_pago: reqMetodoPago('Metodo de pago'),
});
