import { Op, Sequelize } from 'sequelize';
import { calleRamalModel as model } from '../../../models/acciones/calleRamal.model.js';
import { accionModel } from '../../../models/acciones/accion.model.js';

export class calleRamalServices {
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
    const { count, rows } = await model.findAndCountAll({
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
    const dataId = await model.findByPk(id, { raw: true });
    if (!dataId) {
      const err = new Error('No se encontro la calle');
      err.statuCode = 403;
      throw err;
    }
    return dataId;
  }
  static async create(payload) {
    const dataCreated = await model.create(payload);
    return dataCreated;
  }
  static async update(id, payload) {
    const dataSearh = await model.findByPk(id);
    if (!dataSearh) {
      const err = new Error('No existe la calle');
      err.statusCode = 404;
      throw err;
    }
    await dataSearh.update(payload);
    return dataSearh;
  }
  static async delete(id) {
    const calleSearch = await model.findByPk(id);
    if (!calleSearch) {
      const err = new Error('No se encontro la calle');
      err.statuCode = 403;
      throw err;
    }
    const socioSearch = await accionModel.findOne({
      where: {
        calle_ramal_id: id,
      },
    });
    if (socioSearch) {
      const err = new Error('Hay calles usadas en acciones');
      err.statuCode = 403;
      throw err;
    }
    await calleSearch.destroy();

    return;
  }
}
