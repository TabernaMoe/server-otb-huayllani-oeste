import { Op, fn, col, where as sequelizeWhere } from 'sequelize';
import { accionAlcantarilladoModel } from '../../../models/accionAlcantarillado/acccionAlcantarillado.model.js';
import { detalleAlcantarilladoModel } from '../../../models/accionAlcantarillado/detalleAlcantarillado.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';

export class AccionAlcantarilladoRepository {
  static async getAll({
    page = 1,
    limit = 10,
    calle_id = null,
    search = '',
    estado = null,
  }) {
    const offset = (page - 1) * limit;

    const where = {};

    const whereCalle = {};

    if (calle_id) {
      whereCalle.id = calle_id;
    }

    if (estado !== null) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        sequelizeWhere(
          cast(col('accionAlcantarilladoModel.codigo_interno'), 'TEXT'),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),
        {
          '$socioAlcantarillado.nombres$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Primer apellido
        {
          '$socioAlcantarillado.primer_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Segundo apellido
        {
          '$socioAlcantarillado.segundo_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('socioAlcantarillado.nombres'),
            col('socioAlcantarillado.primer_apellido'),
            col('socioAlcantarillado.segundo_apellido'),
          ),
          {
            [Op.iLike]: `%${searchValue}%`,
          },
        ),
      ];
    }

    const { count, rows } = await accionAlcantarilladoModel.findAndCountAll({
      attributes: {
        include: [
          [col('calleAlcantarillado.nombre_calle'), 'nombre_calle'],
          [
            fn(
              'CONCAT_WS',
              ' ',
              col('socioAlcantarillado.nombres'),
              col('socioAlcantarillado.primer_apellido'),
              col('socioAlcantarillado.segundo_apellido'),
            ),
            'nombre_completo_socio',
          ],
          [col('socioAlcantarillado.ci_socio'), 'ci_socio'],
        ],
        exclude: ['createdAt', 'updatedAt', 'socio_id', 'calle_id'],
      },
      include: [
        {
          model: socioModel,
          as: 'socioAlcantarillado',
          attributes: [],
          required: true,
        },
        {
          model: calleRamalModel,
          as: 'calleAlcantarillado',
          attributes: [],
          where: whereCalle,
          required: true,
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      raw: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getById({ id, transaction = null }) {
    const data = await accionAlcantarilladoModel.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: detalleAlcantarilladoModel,
          as: 'detallesAlcantarrillado',
          attributes: ['id'],
        },
      ],
      transaction,
    });
    if (!data) {
      return null;
    }
    const dataNorm = {
      ...data.toJSON(),
      detalles: data?.detallesAlcantarrillado.map((row) => row.id),
      detallesAlcantarrillado: undefined,
    };
    return dataNorm;
  }
  static async create({ payload, detalles, transaction = null }) {
    const data = await accionAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await accionAlcantarilladoModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async changeStatus({ id, transaction = null }) {
    const data = await accionAlcantarilladoModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update({ estado: !data.estado });
    return data;
  }
  static async getUltimaAccion({ transaction }) {
    const data = await accionAlcantarilladoModel.findOne({
      order: [['codigo_interno', 'DESC']],
      attributes: ['codigo_interno'],
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
}
