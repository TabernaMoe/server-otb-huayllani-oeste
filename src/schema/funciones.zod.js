import { z } from 'zod';

/**
 * Convierte strings vacíos a undefined.
 */
const emptyToUndefined = (value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
};

/**
 * Campo texto obligatorio.
 */
export const requiredString = (fieldName, min = 2, max = 100) =>
  z.preprocess(
    emptyToUndefined,
    z
      .string({
        required_error: `${fieldName} es obligatorio`,
        invalid_type_error: `${fieldName} debe ser texto`,
      })
      .trim()
      .min(min, `${fieldName} debe tener al menos ${min} caracteres`)
      .max(max, `${fieldName} no debe superar ${max} caracteres`),
  );

/**
 * CI obligatorio.
 */
export const ciSchema = z.preprocess(
  (value) => {
    if (typeof value === 'string') return Number(value.trim());
    return value;
  },
  z
    .number({
      required_error: 'El CI es obligatorio',
      invalid_type_error: 'El CI debe ser numérico',
    })
    .int('El CI debe ser un número entero')
    .positive('El CI debe ser positivo'),
);

/**
 * Celular boliviano.
 * Normalmente empieza con 6 o 7 y tiene 8 dígitos.
 */
export const celularSchema = z
  .string({
    required_error: 'El número de celular es obligatorio',
    invalid_type_error: 'El celular debe ser texto',
  })
  .trim()
  .regex(/^[67]\d{7}$/, 'El celular debe tener 8 dígitos y empezar con 6 o 7');

/**
 * Teléfono fijo.
 * Permite 7 u 8 dígitos.
 */
export const telefonoSchema = z
  .string({
    required_error: 'El número de teléfono es obligatorio',
    invalid_type_error: 'El teléfono debe ser texto',
  })
  .trim()
  .regex(/^\d{7,8}$/, 'El teléfono debe tener entre 7 y 8 dígitos');

/**
 * Expedido.
 */
export const expedidoSchema = z.enum(
  ['LP', 'CB', 'SC', 'OR', 'PT', 'CH', 'TJ', 'BN', 'PD'],
  {
    required_error: 'El expedido es obligatorio',
    invalid_type_error: 'El expedido no es válido',
  },
);

/**
 * Género.
 */
export const generoSchema = z.enum(['masculino', 'femenino'], {
  required_error: 'El género es obligatorio',
  invalid_type_error: 'El género no es válido',
});

/**
 * Estado acción.
 */
export const estadoAccionSchema = z.enum(['activo', 'pasivo'], {
  required_error: 'El estado de acción es obligatorio',
  invalid_type_error: 'El estado de acción no es válido',
});
