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

export const cambiarM3Schema = z.object({
  consumo_m3: reqInteger('Consumo m3'),
  observacion_modificacion: reqString({
    label: 'Observacion',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La observacion contiene caracteres inválidos',
  }),
});

export const modificarMoraSchema = z.object({
  mora: reqInteger('Mora'),
  observacion_mora: reqString({
    label: 'Observacion',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La observacion contiene caracteres inválidos',
  }),
});
