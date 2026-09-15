import { z } from 'zod';

const idSchema = z.coerce
  .number({
    invalid_type_error: 'El ID debe ser un número',
  })
  .int('El ID debe ser un número entero')
  .positive('El ID debe ser mayor a 0');

export const getIdParamsSchema = z.object({
  id: idSchema,
});

export const optionalNumber = (schema = z.number()) =>
  z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    return Number(value);
  }, schema.optional());

export const QuerySchema = z.object({
  page: optionalNumber(
    z
      .number()
      .int('La página debe ser un entero')
      .min(1, 'La página debe ser mayor a 0'),
  ).default(1),

  limit: optionalNumber(
    z.number().int('El límite debe ser un entero').min(1).max(100),
  ).default(10),

  search: z.string().trim().max(100).optional(),
});
