import z from 'zod';
import {
  reqCelular,
  reqCi,
  reqExpedidoCi,
  reqString,
  reqGenero,
} from '../../validators/funcionesZod.js';
export const socioBaseSchema = z.object({
  ci_socio: reqCi(),

  ci_expedido: reqExpedidoCi(),

  nombres: reqString({
    label: 'Nombre del socio',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El nombre solo debe contener letras',
  }),

  primer_apellido: reqString({
    label: 'Primer apellido',
    min: 2,
    max: 100,
    required: false,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El apellido solo debe contener letras',
  }),

  segundo_apellido: reqString({
    label: 'Segundo apellido',
    min: 2,
    max: 100,
    required: false,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El apellido solo debe contener letras',
  }),

  numero_celular: reqCelular(),

  numero_telefono: reqCelular('Telefono', false),

  genero: reqGenero(),

  direccion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
});

export const socioSchema = socioBaseSchema.superRefine((data, ctx) => {
  const primerApellido = data.primer_apellido?.trim();
  const segundoApellido = data.segundo_apellido?.trim();

  if (!primerApellido && !segundoApellido) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['primer_apellido'],
      message: 'Debe ingresar al menos un apellido',
    });

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['segundo_apellido'],
      message: 'Debe ingresar al menos un apellido',
    });
  }
});
export const updateSocioSchema = socioBaseSchema.partial();
