import { sequelize } from '../../config/database.js';
import { rangoTarifaModel } from '../../models/tarifa/rango.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';

export class TarifaServices {
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
          nombre_tarifa: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await tarifaModel.findAndCountAll({
      include: [
        {
          model: rangoTarifaModel,
          as: 'rangosTarifa',
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
    const dataId = await tarifaModel.findByPk(id, {
      include: [
        {
          model: rangoTarifaModel,
          as: 'rangosTarifa',
        },
      ],
    });
    if (dataId) {
      const err = new Error('No se encontro la tarifa');
      err.statusCode = 404;
      throw err;
    }
    return dataId;
  }
  static async create(payload) {
    const create = await sequelize.transaction(async (t) => {
      const { nombre_tarifa, rangosTarifa = [] } = payload;

      const tarifaSearch = await tarifaModel.findOne({
        where: {
          nombre_tarifa,
        },
        transaction: t,
      });
      if (tarifaSearch) {
        const err = new Error('Ya existe una calle con ese nombre');
        err.statusCode = 400;
        throw err;
      }

      const tarifaCreated = await tarifaModel.create(
        { nombre_tarifa },
        { transaction: t },
      );
      if (rangosTarifa.length === 0) {
        const err = new Error(
          'Debe enviar minimamente un rango para la tarifa',
        );
        err.statusCode = 400;
        throw err;
      }
      await tarifaCreated.addRangosTarifa(rangosTarifa);

      const tarifaReload = await tarifaModel.findByPk(tarifaCreated.id, {
        include: [
          {
            model: rangoTarifaModel,
            as: 'rangosTarifa',
          },
        ],
        transaction: t,
      });

      return tarifaReload;
    });
    return create;
  }
  static async update(id, payload) {
    const update = await sequelize.transaction(async (t) => {
      const { nombre_tarifa, rangosTarifa = [] } = payload;

      const tarifaSearch = await tarifaModel.findByPk(id, { transaction: t });

      if (!tarifaSearch) {
        const err = new Error('No exite la tarifa');
        err.statusCode = 404;
        throw err;
      }

      if (nombre_tarifa !== undefined) {
        await tarifa.update({ nombre_tarifa }, { transaction: t });
      }

      if (Array.isArray(rangosTarifa) && rangosTarifa.length > 0) {
        await tarifaSearch.setRangosTarifa(rangosTarifa, { transaction: t });
      }

      const tarifaReload = await tarifaModel.findByPk(tarifaSearch.id, {
        include: [
          {
            model: rangoTarifaModel,
            as: 'rangosTarifa',
          },
        ],
        transaction: t,
      });

      return tarifaReload;
    });
    return update;
  }
  static async toggleStatus() {}
  static async delete() {}
}
