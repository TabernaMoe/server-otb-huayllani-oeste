import jwt from 'jsonwebtoken';

import { permisoModel } from '../models/auth/permiso.model.js';
import { rolModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';
import { socioModel } from '../models/socio.model.js';

const SOCIO_ROLE = 'usuario_normal';

function buildFullName(socio) {
  return [socio?.nombres, socio?.primer_apellido, socio?.segundo_apellido]
    .filter(Boolean)
    .join(' ')
    .trim();
}

export const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No autorizado' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await usuarioModel.findByPk(decoded.id, {
      include: [
        { model: socioModel, as: 'socio' },
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

    if (!usuario || !usuario.estado) {
      return res.status(401).json({
        ok: false,
        message: usuario ? 'Usuario deshabilitado' : 'Usuario no encontrado',
      });
    }

    const role = usuario.rol?.nombre_rol;
    const isSocio = role === SOCIO_ROLE;

    if (isSocio && !usuario.socio?.id) {
      return res.status(401).json({
        ok: false,
        message: 'La cuenta no está vinculada a un socio',
      });
    }

    req.usuario = {
      user_id: usuario.id,
      id: isSocio ? usuario.socio.id : usuario.id,
      socio_id: isSocio ? usuario.socio.id : null,
      tipo_usuario: isSocio ? 'SOCIO' : 'ADMIN',
      nombre_usuario: usuario.nombre_usuario,
      nombre: isSocio ? buildFullName(usuario.socio) : usuario.nombre_usuario,
      rol: role,
      permisos: isSocio
        ? []
        : (usuario.rol?.permisos ?? []).map((item) => item.codigo_permiso),
      debe_cambiar_password: Boolean(usuario.debe_camibiar_contrasenia),
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, message: 'Token expirado' });
    }

    return res.status(401).json({ ok: false, message: 'Token inválido' });
  }
};

export const checkPermiss = (permisoRequerido) => (req, res, next) => {
  const user = req.usuario;

  if (!user) {
    return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
  }

  if (user.tipo_usuario !== 'ADMIN') {
    return res.status(403).json({
      ok: false,
      message: 'Acceso denegado: cuenta sin acceso administrativo',
    });
  }

  if (user.rol === 'super_admin') {
    return next();
  }

  if (!user.permisos?.includes(permisoRequerido)) {
    return res.status(403).json({
      ok: false,
      message: 'Acceso denegado: permiso insuficiente',
    });
  }

  return next();
};

export const requireSocio = (req, res, next) => {
  if (req.usuario?.tipo_usuario !== 'SOCIO' || !req.usuario?.socio_id) {
    return res.status(403).json({
      ok: false,
      message: 'Acceso exclusivo para socios',
    });
  }

  return next();
};
