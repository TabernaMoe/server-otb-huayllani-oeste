import z from 'zod';
import {
  reqInteger,
  reqIntegerId,
  reqString,
  reqDecimal,
  reqMetodoPago,
} from '../../validators/funcionesZod.js';

export const cobroAguaSchema = z.object({
  monto: reqDecimal(),
  cobro_agua_id: reqInteger('Cobro agua', true, 1),
  metodo_pago: reqMetodoPago(),
  observacion: reqString({
    label: 'Dirección',
    required: false,
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La observacion contiene caracteres inválidos',
  }),
});
