import z from 'zod';

import {
  reqString,
  reqInteger,
  reqEstadoAccion,
  reqArrayInteger,
  reqIntegerSelect,
  reqFecha,
  reqEnum,
} from '../../validators/funcionesZod.js';

export const asambleaSchema = z.object({
  titulo: reqString({
    label: 'Nombre tip accion',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre del tipo accion solo puede contener letras, números, espacios y los caracteres # . -',
  }),
  fecha: reqFecha('Fecha'),
  hora_inicio: reqString({
    label: 'Hora de entrada',
    min: 5,
    max: 5,
    regex: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    regexMessage: 'La hora debe estar en formato HH:MM (ej: 14:30)',
  }),
  hora_final: reqString({
    label: 'Hora de entrada',
    min: 5,
    max: 5,
    regex: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    regexMessage: 'La hora debe estar en formato HH:MM (ej: 14:30)',
  }),
  lugar: reqString({
    label: 'Nombre tip accion',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre del tipo accion solo puede contener letras, números, espacios y los caracteres # . -',
  }),
  monto_multa: reqInteger('multa'),
});

export const asambleaUpdateSchema = asambleaSchema.partial();

export const asambleaUpdateAccion = z.object({
  id_accion: reqInteger('multa'),
  asistio: reqEnum({
    label: 'asitio',
    values: ['ASISTIO', 'FALTA', 'SIN EFECTO'],
  }),
  observacion: reqString({
    label: 'Observacion',
    required: false,
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La Observacion contiene caracteres inválidos',
  }),
});
