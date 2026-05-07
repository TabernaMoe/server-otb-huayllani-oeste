import z from 'zod';
import {
  celularSchema,
  ciSchema,
  estadoAccionSchema,
  expedidoSchema,
  generoSchema,
  requiredString,
  telefonoSchema,
} from '../funciones.zod.js';

/**
 * Schema para crear socio.
 */
export const createSocioSchema = z.object({
  ci_socio: ciSchema,

  ci_expedido_socio: expedidoSchema,

  nombres_socio: requiredString('Los nombres', 2, 100),

  primer_apellido_socio: requiredString('El primer apellido', 2, 100),

  segundo_apellido_socio: requiredString('El segundo apellido', 2, 100),

  numero_celular_socio: celularSchema,

  numero_telefono_socio: telefonoSchema,

  genero_socio: generoSchema,

  estado_accion: estadoAccionSchema,

  direccion_socio: requiredString('La dirección', 3, 150),
});
/**
 * Schema para editar socio.
 * Permite mandar uno o varios campos.
 */
export const updateSocioSchema = createSocioSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });
