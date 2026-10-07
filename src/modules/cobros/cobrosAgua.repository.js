import { cobroModel } from '../../models/cobros/cobro.model.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';
import { socioModel } from '../../models/socio.model.js';
import { col, fn, where as sequelizeWhere } from 'sequelize';

export class CobroAguaRepository {
  static async getAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    let where = {
      tipo_cobro: 'OTRO',
    };

    if (search) {
      where[Op.or] = [
        sequelizeWhere(cast(col('accionCobro.codigo_interno'), 'TEXT'), {
          [Op.iLike]: `%${search}%`,
        }),
        {
          '$socioCobro.nombres$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Primer apellido
        {
          '$socioCobro.primer_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        // Segundo apellido
        {
          '$socioCobro.segundo_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },

        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          {
            [Op.iLike]: `%${searchValue}%`,
          },
        ),
      ];
    }
    const { count, rows } = await cobroModel.findAndCountAll({
      attributes: {
        exclude: ['socio_id', 'accion_id', 'periodo_id'],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col('socioCobro.ci_socio'),
              col('socioCobro.nombres'),
              col('socioCobro.primer_apellido'),
              col('socioCobro.segundo_apellido'),
            ),
            'nombre_socio',
          ],
          [col('accionCobro.codigo_interno'), 'codigo_interno'],
          [col('periodo.mes'), 'periodo'],
        ],
      },
      include: [
        {
          model: accionModel,
          as: 'accionCobro',
          attributes: [],
        },
        {
          model: socioModel,
          as: 'socioCobro',
          attributes: [],
        },
        {
          model: periodoModel,
          as: 'periodo',
          attributes: [],
        },
      ],
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async create({ payload, transaction = null }) {
    const data = await cobroModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await cobroModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async getById({ id, transaction }) {
    const data = await cobroModel.findByPk(id, { transaction, raw: true });
    if (!data) {
      return null;
    }
    return data;
  }
}
