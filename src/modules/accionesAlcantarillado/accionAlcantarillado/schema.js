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

export const accionSchema = z.object({
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

  detallesAlcantarrillado: reqArrayInteger(),
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

  detallesAccion: reqArrayInteger('Detalles accion', false),
});
