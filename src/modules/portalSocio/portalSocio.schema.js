import { z } from 'zod';

export const accionFilterQuerySchema = z.object({
  accion_id: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : val),
      z.coerce
        .number({ invalid_type_error: 'accion_id inválido' })
        .int('accion_id debe ser un entero')
        .positive('accion_id debe ser mayor a 0')
        .optional(),
    )
    .default(undefined),
});

export const changePasswordSchema = z
  .object({
    contrasenia_actual: z.string().min(4, 'Ingrese su contraseña actual'),
    contrasenia_nueva: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña es demasiado larga'),
  })
  .refine((data) => data.contrasenia_actual !== data.contrasenia_nueva, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['contrasenia_nueva'],
  });

export const updatePerfilSchema = z.object({
  numero_celular: z
    .string()
    .trim()
    .min(7, 'El número de celular debe tener al menos 7 dígitos')
    .max(20, 'El número de celular es demasiado largo')
    .regex(/^[0-9+\-\s]+$/, 'Ingrese un número de celular válido'),
  direccion: z
    .string()
    .trim()
    .min(4, 'La dirección debe tener al menos 4 caracteres')
    .max(200, 'La dirección es demasiado larga'),
});
