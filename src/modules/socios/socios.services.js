import { socioModel } from '../../models/socio.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { sequelize } from '../../config/database.js';
import { Op, Sequelize, fn, col } from 'sequelize';
import { auditoriaModel } from '../../models/auth/auditoria.model.js';
import bcrypt from 'bcrypt';
import { accionModel } from '../../models/accion/accion.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';

export class SocioServices {
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

    let where = {};

    if (estado !== undefined) {
      where.estado = estado;
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
                  Sequelize.fn('COALESCE', Sequelize.col('nombres'), ''),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('primer_apellido'),
                    '',
                  ),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('segundo_apellido'),
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
        exclude: ['user_id', 'createdAt', 'updatedAt'],
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
  static async getSelect(search = '') {
    search = search?.trim() || '';

    let where = { estado: true };

    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.fn('COALESCE', Sequelize.col('nombres'), ''),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('primer_apellido'),
                    '',
                  ),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('segundo_apellido'),
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
        ['id', 'value'],
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('ci_socio'),
            '-',
            col('nombres'),
            col('primer_apellido'),
            col('segundo_apellido'),
          ),
          'label',
        ],
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async getId(id) {
    const dataId = await socioModel.findByPk(id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'user_id'],
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
  static async create(id, payload) {
    return sequelize.transaction(async (t) => {
      const { ci_socio, nombre_completo_auditoria, ...datosSocio } = payload;

      const usuarioSearch = await usuarioModel.findByPk(id, { transaction: t });
      if (!usuarioSearch) {
        const err = new Error('No se encontro el usuario');
        err.statuCode = 404;
        throw err;
      }

      const socioSearch = await socioModel.findOne({
        where: {
          ci_socio,
        },
        transaction: t,
      });

      if (socioSearch) {
        const err = new Error('El socio ya existe');
        err.statuCode = 409;
        throw err;
      }

      const passwordHash = await bcrypt.hash(String(ci_socio), 12);

      const userCreated = await usuarioModel.create(
        {
          nombre_usuario: ci_socio,
          contrasenia_usuario: passwordHash,
          rol_id: 2,
        },
        {
          transaction: t,
        },
      );

      const socioCreated = await socioModel.create(
        { ci_socio, ...datosSocio, user_id: userCreated.id },
        { transaction: t },
      );

      const socioWithUser = await socioModel.findByPk(socioCreated.id, {
        include: [
          {
            model: usuarioModel,
            as: 'usuarioSocio',
            attributes: ['id', 'nombre_usuario'],
          },
        ],
        transaction: t,
      });

      const socioJson = socioWithUser.toJSON();

      // await auditoriaModel.create(
      //   {
      //     usuario_id: id,
      //     registro_id: socioJson.id,
      //     tabla_afectada: 'SOCIOS',
      //     accion: 'CREAR',
      //     nombre_completo: nombre_completo_auditoria,
      //     descripcion: `Se creo el socio ${socioJson.ci_socio} ${socioJson.ci_expedido} ${socioJson.nombres} ${socioJson.primer_apellido} ${socioJson.segundo_apellido}`,
      //     datos_anteriores: null,
      //     datos_nuevos: socioJson,
      //   },
      //   {
      //     transaction: t,
      //   },
      // );

      return socioJson;
    });
  }
  static async update(id, payload) {
    const dataUpdate = await sequelize.transaction(async (t) => {
      //----------------
      const socioSearch = await socioModel.findByPk(id, {
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
            as: 'usuarioSocio',
            attributes: ['id', 'nombre_usuario'],
          },
        ],
        transaction: t,
      });

      return socioUpdated;
    });
    return dataUpdate;
  }
  static async cambiarEstado(id) {
    return await sequelize.transaction(async (t) => {
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

      const nuevoEstado = !socioSearch.estado;

      await socioSearch.update({ estado: nuevoEstado }, { transaction: t });

      await usuarioSearch.update({ estado: nuevoEstado }, { transaction: t });

      return {
        message:
          nuevoEstado === true
            ? 'Socio habilitado correctamente'
            : 'Socio deshabilitado correctamente',
        socioSearch,
      };
    });
  }
  static async getDetalle(id) {
    const socioSearch = await socioModel.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] },
    });
    if (!socioSearch) {
      const err = new Error('No se econtro el socio');
      err.statuCode = 404;
      throw err;
    }

    const accionesSearch = await accionModel.findAll({
      attributes: {
        include: [
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
        exclude: ['socio_id', 'calle_id', 'tarifa_id'],
      },
      where: {
        socio_id: id,
      },
      include: [
        { model: calleRamalModel, as: 'calleAccion', attributes: [] },
        { model: tarifaModel, as: 'tarifaAccion', attributes: [] },
      ],
    });
    return { ...socioSearch.toJSON(), acciones: accionesSearch };
  }
}
