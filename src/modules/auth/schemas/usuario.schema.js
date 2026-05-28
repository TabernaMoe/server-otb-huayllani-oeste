import z from 'zod';
import {
  reqString,
  reqArrayIntegerIds,
  reqIntegerId,
} from '../../../validators/funcionesZod.js';

export const userSchema = z.object({
  nombre_usuario: reqString({
    label: 'Nombre de usuario',
    min: 4,
    max: 30,
    regex: /^[a-zA-Z0-9_]+$/,
    regexMessage:
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
  }),
  contrasenia_usuario: reqString({
    label: 'Contraseña',
    min: 8,
    max: 50,
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/,
    regexMessage:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  }),
  rol_id: reqIntegerId({
    label: 'Rol',
  }),
});

export const userUpdateSchema = z.object({
  nombre_usuario: reqString({
    label: 'Nombre de usuario',
    min: 4,
    max: 30,
    required: false,
    regex: /^[a-zA-Z0-9_]+$/,
    regexMessage:
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
  }),
  contrasenia_actual: reqString({
    label: 'Contraseña',
    min: 8,
    max: 50,
    required: false,
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/,
    regexMessage:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  }),
  contrasenia_nueva: reqString({
    label: 'Contraseña',
    min: 8,
    max: 50,
    required: false,
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/,
    regexMessage:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  }),
  rol_id: reqIntegerId({
    label: 'Rol',
    required: false,
  }),
});
