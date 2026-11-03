import { Op } from 'sequelize';
import { tipoAccionModel } from '../../../models/accion/tipoAccion.model.js';

export class tipoAccionServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_tipo_accion: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await tipoAccionModel.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
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
  static async create(payload) {
    const { nombre_tipo_accion } = payload;

    const nombreExist = await tipoAccionModel.findOne({
      where: {
        nombre_tipo_accion,
      },
    });

    if (nombreExist) {
      const err = new Error('Ya existe un registro con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const dataCreated = await tipoAccionModel.create({ nombre_tipo_accion });
    return dataCreated;
  }
  static async update(id, payload) {
    const { nombre_tipo_accion } = payload;

    const dataIdSearch = await tipoAccionModel.findByPk(id);
    if (!dataIdSearch) {
      const err = new Error('No se encotro el registro');
      err.statusCode = 404;
      throw err;
    }

    const nombreExist = await tipoAccionModel.findOne({
      where: {
        nombre_tipo_accion,
      },
    });

    if (nombreExist) {
      const err = new Error('Ya existe un registro con ese nombre');
      err.statusCode = 409;
      throw err;
    }

    await dataIdSearch.update({ nombre_tipo_accion });

    return dataIdSearch;
  }
  static async getSelect() {
    const data = await tipoAccionModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_tipo_accion', 'label'],
      ],
    });
    return data;
  }
}
