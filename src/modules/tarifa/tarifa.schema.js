import { z } from 'zod';

const rangoTarifaSchema = z.object({
  consumo_minimo: z.number().min(0, 'El consumo mínimo no puede ser negativo'),

  consumo_maximo: z
    .number()
    .min(0, 'El consumo máximo no puede ser negativo')
    .nullable(),

  precio: z.number().positive('El precio debe ser mayor a 0'),
});

const validarRangos = (rangos, ctx) => {
  // El último rango debe ser abierto
  if (rangos.length > 0 && rangos[rangos.length - 1].consumo_maximo !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El último rango debe tener consumo_maximo en null',
      path: ['rangosTarifa', rangos.length - 1, 'consumo_maximo'],
    });
  }
  for (let i = 0; i < rangos.length; i++) {
    const rango = rangos[i];

    // Máximo menor al mínimo
    if (
      rango.consumo_maximo !== null &&
      rango.consumo_maximo < rango.consumo_minimo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El consumo máximo no puede ser menor al consumo mínimo',
        path: ['rangosTarifa', i, 'consumo_maximo'],
      });
    }

    // null solamente en el último rango
    if (rango.consumo_maximo === null && i !== rangos.length - 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Solo el último rango puede no tener límite máximo',
        path: ['rangosTarifa', i, 'consumo_maximo'],
      });
    }

    if (i > 0) {
      const anterior = rangos[i - 1];

      // PRECIO: debe ser mayor al precio anterior
      if (rango.precio <= anterior.precio) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El precio debe ser mayor a ${anterior.precio}`,
          path: ['rangosTarifa', i, 'precio'],
        });
      }

      if (anterior.consumo_maximo === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'No pueden existir rangos después de un rango sin límite máximo',
          path: ['rangosTarifa', i],
        });

        continue;
      }

      // Solapamiento
      if (rango.consumo_minimo <= anterior.consumo_maximo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El rango se solapa con el rango anterior',
          path: ['rangosTarifa', i, 'consumo_minimo'],
        });
      }

      // Continuidad
      if (rango.consumo_minimo !== anterior.consumo_maximo + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El rango debe comenzar en ${anterior.consumo_maximo + 1}`,
          path: ['rangosTarifa', i, 'consumo_minimo'],
        });
      }
    }
  }
};

export const tarifaCreateSchema = z
  .object({
    nombre_tarifa: z
      .string()
      .trim()
      .min(1, 'El nombre de la tarifa es obligatorio'),

    rangosTarifa: z
      .array(rangoTarifaSchema)
      .min(1, 'Debe registrar al menos un rango'),
  })
  .superRefine((data, ctx) => {
    validarRangos(data.rangosTarifa, ctx);
  });

export const tarifaUpdateSchema = z
  .object({
    nombre_tarifa: z
      .string()
      .trim()
      .min(1, 'El nombre de la tarifa es obligatorio')
      .optional(),

    rangosTarifa: z
      .array(rangoTarifaSchema)
      .min(1, 'Debe registrar al menos un rango')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.rangosTarifa) {
      validarRangos(data.rangosTarifa, ctx);
    }
  });
