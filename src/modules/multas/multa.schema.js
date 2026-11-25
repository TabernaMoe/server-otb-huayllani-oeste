import z from 'zod';
import {
  reqDecimal,
  reqString,
  reqIntegerId,
} from '../../validators/funcionesZod.js';

export const multaSchema = z.object({
  nombre_multa: reqString({
    label: 'Nombre de calle',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre de la calle solo puede contener letras, números, espacios y los caracteres # . -',
  }),
  precio: reqDecimal('Monto'),
});

export const AsignarMultaSchema = z.object({
  multa_id: reqIntegerId('Socio'),
});

export const multaUpdateSchema = multaSchema.partial();
