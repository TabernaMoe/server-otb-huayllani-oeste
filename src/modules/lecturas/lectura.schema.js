import z from 'zod';
import {
  reqInteger,
  reqIntegerId,
  reqString,
} from '../../validators/funcionesZod.js';

export const lecturaSchema = z.object({
  lectura_actual: reqInteger('Lectura', true, 1),
  observacion: reqString({
    label: 'Dirección',
    required: false,
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La observacion contiene caracteres inválidos',
  }),
});
