import z from 'zod';
import {
  reqIntegerId,
  reqArrayIntegerIds,
  reqDecimal,
  reqMetodoPago,
  reqEnum,
  reqIntegerCobro,
} from '../../../validators/funcionesZod.js';

export const CobroSchema = z.object({
  monto: reqIntegerCobro(),
  cobros: reqArrayIntegerIds({ label: 'Cobros', minItems: 1 }),
  metodo_pago: reqEnum({ label: 'Metodo pago', values: ['QR', 'EFECTIVO'] }),
});

export const AsignarMultaSchema = z.object({
  multa_id: reqIntegerId('Socio'),
});
