import z from 'zod';
import {
  reqString,
  reqArrayIntegerIds,
} from '../../../validators/funcionesZod.js';

export const rolSchema = z.object({
  nombre_rol: reqString({
    label: 'Nombre del rol',
    min: 3,
    max: 40,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    regexMessage: 'El nombre del rol solo puede contener letras y espacios',
  }),
  permisos: reqArrayIntegerIds({
    label: 'Permisos',
    minItems: 1,
    unique: true,
  }),
});

export const rolUpdateSchema = rolSchema.partial();
