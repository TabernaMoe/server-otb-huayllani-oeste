import { usuarioModel } from '../../models/auth/usuario.model.js';
import { rolModel } from '../../models/auth/rol.model.js';
import { permisoModel } from '../../models/auth/permiso.model.js';
import { socioModel } from '../../models/socio.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../helpers/token.helpers.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';
import { col } from 'sequelize';

export class LoginServices {
  static async InicarSesion(nombre_usuario, contrasenia_usuario) {
    const usuarioSearch = await usuarioModel.findOne({
      where: {
        nombre_usuario,
      },
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

    if (!usuarioSearch) {
      const err = new Error('Credenciales incorrectas');
      err.statusCode = 400;
      throw err;
    }

    const isContraseniaCorrecta = await bcrypt.compare(
      contrasenia_usuario,
      usuarioSearch.contrasenia_usuario,
    );
    if (!isContraseniaCorrecta) {
      const err = new Error('Credenciales incorrectas');
      err.statusCode = 403;
      throw err;
    }

    if (!usuarioSearch.estado) {
      const err = new Error('Usuario deshabilitado');
      err.statusCode = 403;
      throw err;
    }

    if (usuarioSearch.rol.nombre_rol === 'usuario_normal') {
      if (!usuarioSearch?.socio?.id) {
        throw new Error('Credenciales incorrectas');
      }

      const token = generateToken(usuarioSearch.socio.id);

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
      return { usuario, token };
    }

    if (usuarioSearch.rol.nombre_rol === 'super_admin') {
      const token = generateToken(usuarioSearch.id);
      return {
        nombre_usuario,
        rol: usuarioSearch.rol.nombre_rol,
        token,
      };
    }
    const token = generateToken(usuarioSearch.id);

    const codigoPermisos = usuarioSearch.rol.permisos.map(
      (row) => row.codigo_permiso,
    );
    return {
      nombre_usuario,
      rol: usuarioSearch.rol.nombre_rol,
      permisos: codigoPermisos,
      token,
    };
  }
  static async updateMe(id, payload, tipo_usuario) {
    if (tipo_usuario === 'ESPECIAL') {
      const { contrasenia_antigua, contrasenia_nueva } = payload;

      const userSearch = await usuarioModel.findByPk(id);
      if (!userSearch) {
        const err = new Error('No se encotro el usuario');
        err.statusCode = 404;
        throw err;
      }

      const isValido = await bcrypt.compare(
        contrasenia_antigua,
        userSearch.contrasenia_usuario,
      );

      if (!isValido) {
        const err = new Error('Contraseña actual incorrecta');
        throw err;
      }

      await userSearch.update({ contrasenia_usuario: contrasenia_nueva });
      return;
    } else {
      const { contrasenia_antigua, contrasenia_nueva } = payload;

      const socioSearch = await socioModel.findByPk(id);

      if (!socioSearch) {
        const err = new Error('Socio no encontrado');
        err.statusCode = 404;
        throw err;
      }

      const userSearch = await usuarioModel.findByPk(socioSearch.user_id);
      if (!userSearch) {
        const err = new Error('No se encotro el usuario');
        err.statusCode = 404;
        throw err;
      }

      const isValido = await bcrypt.compare(
        contrasenia_antigua,
        userSearch.contrasenia_usuario,
      );

      if (!isValido) {
        const err = new Error('Contraseña actual incorrecta');
        throw err;
      }

      await userSearch.update({ contrasenia_usuario: contrasenia_nueva });
      return;
    }
  }
}
