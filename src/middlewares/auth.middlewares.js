import { usuarioModel } from '../models/auth/usuario.model.js';
import { rolModel } from '../models/auth/rol.model.js';
import { permisoModel } from '../models/auth/permiso.model.js';
import { socioModel } from '../models/socio.model.js';
import { calleRamalModel } from '../models/calleRamal.model.js';
import { tarifaModel } from '../models/tarifa/tarifa.model.js';
import { accionModel } from '../models/accion/accion.model.js';
import jwt from 'jsonwebtoken';

export const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'No autorizado',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuarioSearch = await usuarioModel.findByPk(decoded.id, {
      include: [
        {
          model: socioModel,
          as: 'socio',
          attributes: ['id'],
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

    if (!usuarioSearch) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no encontrado',
      });
    }
    if (!usuarioSearch.estado) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario deshabilidato',
      });
    }

    if (usuarioSearch.rol.nombre_rol === 'usuario_normal') {
      if (!usuarioSearch?.socio?.id) {
        throw new Error('Credenciales incorrectas');
      }

      const acciones = await accionModel.findAll({
        attributes: {
          include: [
            [col('calleAccion.nombre_calle'), 'nombre_calle'],
            [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
          ],
        },
        where: {
          socio_id: usuarioSearch.socio.id,
        },
        include: [
          {
            model: calleRamalModel,
            as: 'calleAccion',
            attributes: [],
          },
          {
            model: tarifaModel,
            as: 'tarifaAccion',
            attributes: [],
          },
        ],
      });
      const usuario = {
        tipo_usuario: 'NORMAL',
        id: usuarioSearch?.socio?.id,
        rol: usuarioSearch.rol.nombre_rol,
        ci_socio: usuarioSearch.socio.ci_socio,
        ci_expedido: usuarioSearch.socio.ci_expedido,
        nombre_completo: `${usuarioSearch.socio.nombres} ${usuarioSearch.socio.primer_apellido} ${usuarioSearch.socio.segundo_apellido}`,
        numero_celular: usuarioSearch.socio.numero_celular,
        numero_telefono: usuarioSearch.socio.numero_telefono ?? '',
        genero: usuarioSearch.socio.genero,
        direccion: usuarioSearch.socio.direccion,
        acciones,
      };
      req.usuario = usuario;
      return next();
    }

    if (usuarioSearch.rol.nombre_rol === 'super_admin') {
      req.usuario = {
        id: usuarioSearch.id,
        tipo_usuario: 'ESPECIAL',
        nombre_usuario: usuarioSearch.nombre_usuario,
        rol: usuarioSearch.rol.nombre_rol,
        token,
      };
      return next();
    }
    const codigoPermisos = usuarioSearch.rol.permisos.map(
      (row) => row.codigo_permiso,
    );
    req.usuario = {
      tipo_usuario: 'ESPECIAL',
      id: usuarioSearch.id,
      nombre_usuario: usuarioSearch.nombre_usuario,
      rol: usuarioSearch.rol.nombre_rol,
      permisos: codigoPermisos,
      token,
    };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        message: 'Token expirado',
      });
    }

    return res.status(401).json({
      ok: false,
      message: 'Token inválido',
    });
  }
};
export const checkPermiss = (permisoRequerido) => (req, res, next) => {
  try {
    const user = req.usuario;
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no encontrado',
      });
    }

    const rolPrincipal = user.rol;

    const isSuperAdmin = rolPrincipal === 'super_admin';

    if (isSuperAdmin) {
      return next();
    }

    const permisos = user?.permisos;
    if (!permisos) {
      return res.status(401).json({
        ok: false,
        message: 'Permisos no encontrados',
      });
    }

    const tienePermiso = permisos.includes(permisoRequerido);

    if (!tienePermiso) {
      return res.status(403).json({
        ok: false,
        message: 'Acceso denegado: permiso insuficiente',
      });
    }
    return next();
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: 'Error verificando permisos',
      error: error.message,
    });
  }
};
