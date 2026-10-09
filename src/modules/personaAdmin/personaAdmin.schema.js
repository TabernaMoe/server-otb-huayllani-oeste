import z from 'zod';
import {
  reqCi,
  reqExpedidoCi,
  reqIntegerId,
  reqString,
} from '../../validators/funcionesZod.js';

export const personaAdminSchema = z.object({
  cargo: reqString({ label: 'Cargo' }),
  cedula_identidad: reqCi(),
  ci_expedido: reqExpedidoCi(),
  nombre: reqString({ label: 'Nombres' }),
  apellido_paterno: reqString({ label: 'Apellido paterno' }),
  apellido_materno: reqString({ label: 'Apellido materno' }),
  contrasenia: reqString({ label: 'Contraseña' }),
  rol_id: reqIntegerId({ label: 'Rol' }),
});

export const personaAdminUpdateSchema = personaAdminSchema.partial();
