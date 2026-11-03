import z from 'zod';
import {
  reqString,
  reqInteger,
  reqEstadoAccion,
  reqArrayInteger,
  reqIntegerSelect,
  reqIntegerId,
  reqEnum,
  reqDecimal,
} from '../../../../validators/funcionesZod.js';

export const accionSchema = z.object({
  socio_id: reqIntegerSelect('Socio'),
  calle_id: reqIntegerSelect('Calle'),
  tarifa_id: reqIntegerSelect('Tarifa'),
  nro_medidor: reqString({ label: 'Nro medidor', min: 3, required: false }),
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
    required: false,
  }),
  estado: reqEstadoAccion(),

  detallesAccion: reqArrayInteger(),
});

export const accionUpdateSchema = z.object({
  calle_id: reqIntegerSelect('Calle', false),
  tarifa_id: reqIntegerSelect('Tarifa', false),
  nro_medidor: reqString({ label: 'Nro medidor', min: 3, required: false }),
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

export const estadoAccionSchema = z.object({
  estado: reqEstadoAccion(),
});

export const cambioNombreSchema = z.object({
  accion_id: reqIntegerId({ label: 'Accion' }),
  socio_nuevo_id: reqIntegerId({ label: 'Socio Nuevo' }),
  tipo: reqEnum({ label: 'tipo', values: ['FAMILIAR', 'AJENO'] }),
  observacion: reqString({
    label: 'Observacion',
  }),
  monto: reqDecimal(),
});
