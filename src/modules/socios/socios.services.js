import { socioModel } from '../../models/socio.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { sequelize } from '../../config/database.js';
import { Op, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export class SocioServices {
  static async getAll(page = 1, limit = 10, search = '', estado = '') {
    const offset = (page - 1) * limit;

    let where = {};

    const valoresPermitidos = ['ACTIVO', 'PASIVO', 'ANULADO'];
    // Validar que si se envió estado, sea válido
    if (estado && !valoresPermitidos.includes(estado)) {
      throw new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );
    }

    if (!estado) {
      where = {
        estado_accion: {
          [Op.ne]: 'ANULADO', // no mostrar los anulados
        },
      };
    } else {
      where.estado_accion = estado;
    }

    // Si hay búsqueda, agregamos las condiciones OR
    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              { nombres_socio: { [Op.iLike]: `%${search}%` } },
              { primer_apellido_socio: { [Op.iLike]: `%${search}%` } },
              { segundo_apellido_socio: { [Op.iLike]: `%${search}%` } },
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
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
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
    const dataId = await socioModel.findByPk(id, { raw: true });
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
  static async disable(id) {
    const dataDelete = await sequelize.transaction(async (t) => {
      const socioSearch = await socioModel.findByPk(id, {
        transaction: t,
        raw: true,
      });
      if (!socioSearch) {
        const err = new Error('El socio no existe');
        err.statusCode = 404;
        throw err;
      }

      const usuarioSearch = await usuarioModel.findByPk(socioSearch.user_id, {
        transaction: t,
        raw: true,
      });
      if (!usuarioSearch) {
        const err = new Error('El usuario del socio no existe');
        err.statusCode = 404;
        throw err;
      }
      await usuarioSearch.update(
        { estado_usuario: 'INHABILITADO' },
        { transaction: t },
      );

      await socioSearch.update(
        { estado_accion: 'ANULADO' },
        { transaction: t },
      );

      return {
        message: 'Socio inhabilitado correctamente',
      };
    });

    return dataDelete;
  }
}
