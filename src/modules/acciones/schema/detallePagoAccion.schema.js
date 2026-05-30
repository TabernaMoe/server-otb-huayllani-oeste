import z from 'zod';
import {
  reqString,
  reqDecimal,
  reqEnum,
} from '../../../validators/funcionesZod.js';

export const detallePagoAccionSchema = z.object({
  nombre_accion: reqString({
    label: 'Nombre de calle',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre de la calle solo puede contener letras, números, espacios y los caracteres # . -',
  }),
  precio_accion: reqDecimal('Precio accion'),
  tipo_cobro: reqEnum({
    label: 'Tipo de cobro',
    values: ['UNICO', 'MENSUAL'],
  }),
});

export const detallePagoAccionUpdateSchema = detallePagoAccionSchema.partial();
