import { socioModel } from '../../models/socio.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { sequelize } from '../../config/database.js';
import { Op, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export class SocioServices {
  static async getAll(page = 1, limit = 10, search = '', estado = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    estado = estado?.trim()?.toUpperCase() || '';
    search = search?.trim() || '';

    const valoresPermitidos = ['HABILITADO', 'DESHABILITADO'];

    if (estado && !valoresPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );
      error.status = 400;
      throw error;
    }

    let where = {};

    if (estado) {
      where.estado_socio = estado;
    }

    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.fn('COALESCE', Sequelize.col('nombres_socio'), ''),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('primer_apellido_socio'),
                    '',
                  ),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('segundo_apellido_socio'),
                    '',
                  ),
                ),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
              Sequelize.where(
                Sequelize.cast(Sequelize.col('ci_socio'), 'TEXT'),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
            ],
          },
        ],
      };
    }

    const { count, rows } = await socioModel.findAndCountAll({
      attributes: {
        exclude: ['user_id', 'createdAt', 'updatedAt', 'deletedAt'],
      },
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
  static async getAllSelect(search = '') {
    search = search?.trim() || '';

    let where = { estado_socio: 'HABILITADO' };

    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.fn('COALESCE', Sequelize.col('nombres_socio'), ''),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('primer_apellido_socio'),
                    '',
                  ),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('segundo_apellido_socio'),
                    '',
                  ),
                ),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
              Sequelize.where(
                Sequelize.cast(Sequelize.col('ci_socio'), 'TEXT'),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
            ],
          },
        ],
      };
    }
    const data = await socioModel.findAll({
      where,
      attributes: [
        'id',
        'ci_socio',
        'nombres_socio',
        'primer_apellido_socio',
        'segundo_apellido_socio',
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async getAllDeleteds(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    let where = {
      deleted_at: {
        [Op.ne]: null,
      },
    };

    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.fn('COALESCE', Sequelize.col('nombres_socio'), ''),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('primer_apellido_socio'),
                    '',
                  ),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('segundo_apellido_socio'),
                    '',
                  ),
                ),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
              Sequelize.where(
                Sequelize.cast(Sequelize.col('ci_socio'), 'TEXT'),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
            ],
          },
        ],
      };
    }

    const { count, rows } = await socioModel.findAndCountAll({
      attributes: {
        exclude: ['user_id', 'createdAt', 'updatedAt', 'deletedAt'],
      },
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      paranoid: false,
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
    const dataId = await socioModel.findByPk(id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'user_id'],
      },
      raw: true,
    });
    if (!dataId) {
      const err = new Error('No se encontro al socio');
      err.statuCode = 403;
      throw err;
    }
    return dataId;
  }
  static async create(payload) {
    const dataCreate = await sequelize.transaction(async (t) => {
      const { ci_socio } = payload;

      const socioSearch = await socioModel.findOne({
        where: {
          ci_socio,
        },
        paranoid: false,
        transaction: t,
      });

      if (socioSearch) {
        const err = new Error('El socio ya existe');
        err.statuCode = 403;
        throw err;
      }

      const passwordHash = await bcrypt.hash(String(ci_socio), 12);

      const userCreated = await usuarioModel.create(
        {
          nombre_usuario: ci_socio,
          contrasenia_usuario: passwordHash,
        },
        {
          transaction: t,
        },
      );

      const socioCreated = await socioModel.create(
        { ...payload, user_id: userCreated.id },
        { transaction: t },
      );

      const socioWithUser = await socioModel.findByPk(socioCreated.id, {
        include: [
          {
            model: usuarioModel,
            as: 'socio_usuario',
            attributes: ['id', 'nombre_usuario'],
          },
        ],
        transaction: t,
      });

      return socioWithUser;
    });
    return dataCreate;
  }
  static async update(id, payload) {
    const dataUpdate = await sequelize.transaction(async (t) => {
      const socioSearch = await socioModel.findByPk(id, {
        include: [
          {
            model: usuarioModel,
            as: 'socio_usuario',
          },
        ],
        transaction: t,
      });
      if (!socioSearch) {
        const err = new Error('El socio no existe');
        err.statusCode = 404;
        throw err;
      }
      // Verificar si otro socio ya tiene ese CI
      if (payload.ci_socio) {
        const socioDuplicate = await socioModel.findOne({
          where: {
            ci_socio: payload.ci_socio,
          },
          transaction: t,
        });

        if (socioDuplicate && socioDuplicate.id !== socioSearch.id) {
          const err = new Error('El CI ya está registrado');
          err.statusCode = 403;
          throw err;
        }
      }
      // Actualizar socio
      await socioSearch.update(payload, {
        transaction: t,
      });

      // Si cambió el CI actualizar usuario
      if (payload.ci_socio && payload.ci_socio !== socioSearch.ci_socio) {
        await socioSearch.socio_usuario.update(
          {
            nombre_usuario: payload.ci_socio,
          },
          {
            transaction: t,
          },
        );
      }

      const socioUpdated = await socioModel.findByPk(id, {
        include: [
          {
            model: usuarioModel,
            as: 'socio_usuario',
            attributes: ['id', 'nombre_usuario'],
          },
        ],
        transaction: t,
      });
      return socioUpdated;
    });
    return dataUpdate;
  }
  static async delete(id) {
    const dataDelete = await sequelize.transaction(async (t) => {
      const socioSearch = await socioModel.findByPk(id, {
        transaction: t,
      });
      if (!socioSearch) {
        const err = new Error('El socio no existe');
        err.statusCode = 404;
        throw err;
      }
      const usuarioSearch = await usuarioModel.findByPk(socioSearch.user_id, {
        transaction: t,
      });
      if (!usuarioSearch) {
        const err = new Error('El usuario del socio no existe');
        err.statusCode = 404;
        throw err;
      }
      await usuarioSearch.update(
        { estado_usuario: 'DESHABILITADO' },
        { transaction: t },
      );

      await socioSearch.destroy({ transaction: t });

      return {
        message: 'Socio eliminado correctamente',
      };
    });

    return dataDelete;
  }
  static async toggleStatus(id) {
    return await sequelize.transaction(async (t) => {
      const socioSearch = await socioModel.findByPk(id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        transaction: t,
      });

      if (!socioSearch) {
        const err = new Error('El socio no existe');
        err.statusCode = 404;
        throw err;
      }

      const usuarioSearch = await usuarioModel.findByPk(socioSearch.user_id, {
        transaction: t,
      });

      if (!usuarioSearch) {
        const err = new Error('El usuario del socio no existe');
        err.statusCode = 404;
        throw err;
      }

      const nuevoEstado =
        socioSearch.estado_socio === 'HABILITADO'
          ? 'DESHABILITADO'
          : 'HABILITADO';

      await socioSearch.update(
        { estado_socio: nuevoEstado },
        { transaction: t },
      );

      await usuarioSearch.update(
        { estado_usuario: nuevoEstado },
        { transaction: t },
      );

      return {
        message:
          nuevoEstado === 'HABILITADO'
            ? 'Socio habilitado correctamente'
            : 'Socio deshabilitado correctamente',
        socioSearch,
      };
    });
  }
  static async restore(id) {
    return await sequelize.transaction(async (t) => {
      const socioSearch = await socioModel.findByPk(id, {
        paranoid: false,
        transaction: t,
      });

      if (!socioSearch) {
        const err = new Error('Socio no encontrado');
        err.statusCode = 404;
        throw err;
      }

      await socioSearch.restore({ transaction: t });

      return {
        message: 'Socio restaurado correctamente',
        data: socioSearch,
      };
    });
  }
}
