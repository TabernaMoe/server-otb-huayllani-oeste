import z from 'zod';
import {
  reqString,
  reqInteger,
  reqEstadoAccion,
  reqArrayInteger,
  reqIntegerSelect,
  reqIntegerId,
  reqEnum,
} from '../../../validators/funcionesZod.js';

export const accionAlcantarilladoSchema = z.object({
  socio_id: reqIntegerSelect('Socio'),
  calle_id: reqIntegerSelect('Calle'),
  //
  direccion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
  observacion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),

  detalles: reqArrayInteger(),
});

export const accionUpdateSchema = z.object({
  calle_id: reqIntegerSelect('Calle', false),
  //
  direccion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
    required: false,
  }),
  observacion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
    required: false,
  }),
  estado: reqEstadoAccion('Estado', false),

  detalles: reqArrayInteger('Detalles accion', false),
});

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int('La página debe ser un número entero')
    .positive('La página debe ser mayor a 0')
    .default(1),

  limit: z.coerce
    .number()
    .int('El límite debe ser un número entero')
    .positive('El límite debe ser mayor a 0')
    .max(100, 'El límite máximo es 100')
    .default(10),

  search: z
    .string()
    .trim()
    .max(100, 'La búsqueda no debe superar los 100 caracteres')
    .optional()
    .default(''),
  estado: z
    .enum(['true', 'false'], {
      message: 'El estado solo puede ser true o false',
    })
    .transform((value) => value === 'true')
    .optional(),
  calle_id: reqIntegerId({ label: 'calle', required: false }),
});
