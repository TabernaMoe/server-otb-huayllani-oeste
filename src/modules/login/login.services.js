import bcrypt from 'bcrypt';

import { generateToken } from '../../helpers/token.helpers.js';
import { permisoModel } from '../../models/auth/permiso.model.js';
import { rolModel } from '../../models/auth/rol.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { socioModel } from '../../models/socio.model.js';

const SOCIO_ROLE = 'usuario_normal';

function buildFullName(socio) {
  return [socio?.nombres, socio?.primer_apellido, socio?.segundo_apellido]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function buildSessionUser(usuario) {
  const role = usuario.rol?.nombre_rol ?? null;
  const isSocio = role === SOCIO_ROLE;
  const permissions = isSocio
    ? []
    : (usuario.rol?.permisos ?? []).map((item) => item.codigo_permiso);

  return {
    id: usuario.id,
    nombre_usuario: usuario.nombre_usuario,
    nombre: isSocio ? buildFullName(usuario.socio) : usuario.nombre_usuario,
    rol: role,
    tipo_usuario: isSocio ? 'SOCIO' : 'ADMIN',
    socio_id: isSocio ? usuario.socio?.id ?? null : null,
    permisos: permissions,
    debe_cambiar_password: Boolean(usuario.debe_camibiar_contrasenia),
  };
}

export class LoginServices {
  static async iniciarSesion(nombre_usuario, contrasenia_usuario) {
    const usuario = await usuarioModel.findOne({
      where: { nombre_usuario },
      include: [
        {
          model: socioModel,
          as: 'socio',
        },
        {
          model: rolModel,
          as: 'rol',
          attributes: ['nombre_rol'],
          include: [
            {
              model: permisoModel,
              as: 'permisos',
              attributes: ['codigo_permiso'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!usuario) {
      const error = new Error('Credenciales incorrectas');
      error.statusCode = 400;
      throw error;
    }

    const passwordIsValid = await bcrypt.compare(
      contrasenia_usuario,
      usuario.contrasenia_usuario,
    );

    if (!passwordIsValid) {
      const error = new Error('Credenciales incorrectas');
      error.statusCode = 403;
      throw error;
    }

    if (!usuario.estado) {
      const error = new Error('Usuario deshabilitado');
      error.statusCode = 403;
      throw error;
    }

    const sessionUser = buildSessionUser(usuario);

    if (sessionUser.tipo_usuario === 'SOCIO' && !sessionUser.socio_id) {
      const error = new Error('La cuenta no está vinculada a un socio');
      error.statusCode = 403;
      throw error;
    }

    return {
      usuario: sessionUser,
      token: generateToken(usuario.id),
    };
  }

  static async updateMe(userId, payload) {
    const { contrasenia_antigua, contrasenia_nueva } = payload;
    const usuario = await usuarioModel.findByPk(userId);

    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const passwordIsValid = await bcrypt.compare(
      contrasenia_antigua,
      usuario.contrasenia_usuario,
    );

    if (!passwordIsValid) {
      const error = new Error('Contraseña actual incorrecta');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(contrasenia_nueva, 12);
    await usuario.update({
      contrasenia_usuario: passwordHash,
      debe_camibiar_contrasenia: false,
    });
  }
}
