import z from 'zod';

export const changePasswordSchema = z.object({
  contrasenia_actual: z.string().min(4, 'Ingrese su contraseña actual'),
  contrasenia_nueva: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
});
