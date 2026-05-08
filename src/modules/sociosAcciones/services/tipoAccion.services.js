import { Op, Sequelize } from 'sequelize';
import { tipoAccionModel as services } from '../models/tipoAccion.model.js';
import { tipoAccionAccionModel } from '../models/tipoAccionAccion.model.js';

export class tipoAccionServices {
  static async getAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_calle: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }
    const { count, rows } = await services.findAndCountAll({
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
    const dataId = await services.findByPk(id, { raw: true });
    if (!dataId) {
      const err = new Error('No se encontro la calle');
      err.statuCode = 403;
      throw err;
    }
    return dataId;
  }
  static async create(payload) {
    const dataCreated = await services.create(payload);
    return dataCreated;
  }
  static async update(payload) {
    const dataUpdated = await services.update(payload);
  }
  static async delete(id) {
    const dataSearch = await services.findByPk(id);
    if (!dataSearch) {
      const err = new Error('No se encontro la calle');
      err.statuCode = 403;
      throw err;
    }
    const socioSearch = await tipoAccionAccionModel.findOne({
      where: {
        tipo_accion_id: dataSearch.id,
      },
    });
    if (socioSearch) {
      const err = new Error('Este tipo de accion esta siendo usada');
      err.statuCode = 403;
      throw err;
    }
    await dataSearch.destroy();

    return;
  }
}
