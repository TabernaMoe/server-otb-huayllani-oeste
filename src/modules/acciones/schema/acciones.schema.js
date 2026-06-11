import z from 'zod';
import {
  reqString,
  reqInteger,
  reqEstadoAccion,
  reqArrayInteger,
  reqIntegerSelect,
} from '../../../validators/funcionesZod.js';

export const accionSchema = z.object({
  socio_id: reqIntegerSelect('Socio'),
  calle_id: reqIntegerSelect('Calle'),
  tarifa_id: reqIntegerSelect('Tarifa'),
  nro_medidor: reqString({ label: 'Nro medidor', min: 3 }),
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
  estado: reqEstadoAccion(),

  detallesAccion: reqArrayInteger(),
});

export const accionUpdateSchema = accionSchema.partial();
