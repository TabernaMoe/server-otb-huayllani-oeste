import { Op } from 'sequelize';
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
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          attributes: { exclude: ['tarifa_id', 'id'] },
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
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      include: [
        {
          attributes: { exclude: ['tarifa_id', 'id'] },
          model: rangoTarifaModel,
          as: 'rangosTarifa',
        },
      ],
    });
    if (!dataId) {
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
      const rangosCreate = rangosTarifa.map((rango) => ({
        ...rango,
        tarifa_id: tarifaCreated.id,
      }));

      await rangoTarifaModel.bulkCreate(rangosCreate, {
        transaction: t,
      });

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
        await tarifaSearch.update({ nombre_tarifa }, { transaction: t });
      }

      if (Array.isArray(rangosTarifa) && rangosTarifa.length > 0) {
        await rangoTarifaModel.destroy({
          where: {
            tarifa_id: tarifaSearch.id,
          },
          transaction: t,
        });

        await rangoTarifaModel.bulkCreate(
          rangosTarifa.map((r) => ({
            ...r,
            tarifa_id: tarifaSearch.id,
          })),
          { transaction: t },
        );
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
  static async toggleStatus(id) {
    const dataSearch = await tarifaModel.findByPk(id);
    if (!dataSearch) {
      const err = new Error('No exite la tarifa');
      err.statusCode = 404;
      throw err;
    }
    dataSearch.estado = !dataSearch.estado;
    await dataSearch.save();
    return;
  }
  static async delete(id) {
    const dataSearch = await tarifaModel.findByPk(id);
    if (!dataSearch) {
      const err = new Error('No exite la tarifa');
      err.statusCode = 404;
      throw err;
    }
    //validar que no este siendo usado
    await dataSearch.destroy();
    return;
  }
}
