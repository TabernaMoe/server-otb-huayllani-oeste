import { usuarioModel } from '../../../models/auth/usuario.model.js';
import { rolModel } from '../../../models/auth/rol.model.js';
import { Op } from 'sequelize';
import { sequelize } from '../../../config/database.js';

import bcrypt from 'bcrypt';

export class UsuarioServices {
  static async getAll(page = 1, limit = 10, search = '', estado = undefined) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const valoresPermitidos = [true, false];

    if (estado !== undefined && !valoresPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );

      error.status = 400;
      throw error;
    }

    const where = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        {
          nombre_usuario: {
            [Op.iLike]: `%${search}%`,
          },
        },

        {
          '$rol.nombre_rol$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await usuarioModel.findAndCountAll({
      attributes: {
        exclude: ['contrasenia_usuario', 'rol_id'],
      },
      include: [
        {
          model: rolModel,
          as: 'rol',
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getId(id) {
    const datoId = await usuarioModel.findByPk(id, {
      attributes: { exclude: ['contrasenia_usuario'] },
    });
    if (!datoId) {
      const err = new Error('No se encontro el usuario');
      err.statusCode = 404;
      throw err;
    }
    return datoId;
  }
  static async create(payload) {
    const created = await sequelize.transaction(async (t) => {
      const { nombre_usuario, contrasenia_usuario, rol_id } = payload;

      const usuarioSearch = await usuarioModel.findOne({
        where: {
          nombre_usuario,
        },
        raw: true,
      });
      if (usuarioSearch) {
        const err = new Error('Ya existe un usuario con ese nombre');
        err.statusCode = 400;
        throw err;
      }
      const rolSearch = await rolModel.findByPk(rol_id, {
        raw: true,
      });

      if (!rolSearch) {
        const err = new Error('No existe el rol');
        err.statusCode = 404;
        throw err;
      }

      const passPasword = await bcrypt.hash(contrasenia_usuario, 10);

      const UsuarioCreated = await usuarioModel.create(
        {
          nombre_usuario,
          contrasenia_usuario: passPasword,
          rol_id,
        },
        {
          transaction: t,
        },
      );

      const userReoload = await usuarioModel.findByPk(UsuarioCreated.id, {
        attributes: { exclude: ['contrasenia_usuario'] },
        include: [
          {
            model: rolModel,
            as: 'rol',
          },
        ],
        transaction: t,
      });

      return userReoload;
    });

    return created;
  }
  static async update(id, payload) {
    const updated = await sequelize.transaction(async (t) => {
      const { nombre_usuario, rol_id, contrasenia_actual, contrasenia_nueva } =
        payload;

      const usuarioSearch = await usuarioModel.findByPk(id, {
        transaction: t,
      });

      if (!usuarioSearch) {
        const err = new Error('Usuario no encontrado');
        err.statusCode = 404;
        throw err;
      }

      if (nombre_usuario) {
        const usuarioDuplicado = await usuarioModel.findOne({
          where: {
            nombre_usuario,
            id: { [Op.ne]: id },
          },
          transaction: t,
        });

        if (usuarioDuplicado) {
          const err = new Error('Ya existe un usuario con ese nombre');
          err.statusCode = 400;
          throw err;
        }
      }

      if (rol_id) {
        const rolSearch = await rolModel.findByPk(rol_id, {
          transaction: t,
        });

        if (!rolSearch) {
          const err = new Error('No existe el rol');
          err.statusCode = 404;
          throw err;
        }
      }

      const dataUpdate = {};

      if (nombre_usuario) {
        dataUpdate.nombre_usuario = nombre_usuario;
      }

      if (rol_id) {
        dataUpdate.rol_id = rol_id;
      }

      if (contrasenia_nueva) {
        if (!contrasenia_actual) {
          const err = new Error('Debe enviar la contraseña actual');
          err.statusCode = 400;
          throw err;
        }

        const passwordValida = await bcrypt.compare(
          contrasenia_actual,
          usuarioSearch.contrasenia_usuario,
        );

        if (!passwordValida) {
          const err = new Error('La contraseña actual es incorrecta');
          err.statusCode = 400;
          throw err;
        }

        dataUpdate.contrasenia_usuario = await bcrypt.hash(
          contrasenia_nueva,
          10,
        );
      }

      await usuarioSearch.update(dataUpdate, {
        transaction: t,
      });

      const usuarioReload = await usuarioModel.findByPk(usuarioSearch.id, {
        attributes: { exclude: ['contrasenia_usuario'] },
        include: [
          {
            model: rolModel,
            as: 'rol',
          },
        ],
      });
      return usuarioReload;
    });

    return updated;
  }
  static async toggleStatus(id) {
    const userSearch = await usuarioModel.findByPk(id);

    if (!userSearch) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }

    await userSearch.update({
      estado: !userSearch.estado,
    });

    return userSearch;
  }
}
