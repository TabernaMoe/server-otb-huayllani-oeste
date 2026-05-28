import z from 'zod';
import { reqString } from '../../validators/funcionesZod.js';

export const calleRamalSchema = z.object({
  nombre_calle: reqString({
    label: 'Nombre de calle',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre de la calle solo puede contener letras, números, espacios y los caracteres # . -',
  }),
});
