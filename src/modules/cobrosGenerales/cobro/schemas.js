import {
  reqArrayInteger,
  reqDecimal,
  reqEnum,
} from '../../../validators/funcionesZod.js';
import z from 'zod';

export const CobroQuery = z.object({
  tipo_cobro: reqEnum({
    label: 'Tipo cobro',
    required: false,
    values: ['TODOS'],
  }),
});

export const PagarSchema = z.object({
  metodo_pago: reqEnum({ label: 'Metodo de pago', values: ['EFECTIVO', 'QR'] }),
  monto: reqDecimal({ label: 'Monto' }),
  cobros: reqArrayInteger('Cobros'),
});
