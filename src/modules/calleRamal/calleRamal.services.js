import { calleRamalModel as model } from '../../models/calleRamal.model.js';
import { Op } from 'sequelize';

export class CalleRamalServices {
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
          nombre_usuario: {
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
    const datoId = await model.findByPk(id, { raw: true });
    if (!datoId) {
      const err = new Error('No se encontro la calle');
      err.statusCode = 404;
      throw err;
    }
    return datoId;
  }
  static async create(payload) {
    const { nombre_calle } = payload;

    const calleSearch = await model.findOne({
      where: {
        nombre_calle,
      },
    });

    if (calleSearch) {
      const err = new Error('Ya existe una calle con ese nombre');
      err.statusCode = 400;
      throw err;
    }

    const created = await model.create({ nombre_calle });
    return created;
  }
  static async update(id, payload) {
    const { nombre_calle } = payload;

    const calleUpdate = await model.findByPk(id);

    if (!calleUpdate) {
      const err = new Error('No exites la calle');
      err.statusCode = 400;
      throw err;
    }

    const calleSearch = await model.findOne({
      where: {
        nombre_calle,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (calleSearch) {
      const err = new Error('Ya existe una calle con ese nombre');
      err.statusCode = 400;
      throw err;
    }

    await calleUpdate.update({ nombre_calle });
    return calleUpdate;
  }
  static async delete(id) {
    const dataId = await model.findByPk(id);
    if (!dataId) {
      const err = new Error('No exites la calle');
      err.statusCode = 400;
      throw err;
    }

    //relaciones socios agregar

    //
    await dataId.destroy();
    return;
  }
  static async toggleStatus(id) {
    const dataId = await model.findByPk(id);
    if (!dataId) {
      const err = new Error('No exites la calle');
      err.statusCode = 400;
      throw err;
    }

    await model.update({
      estado: !dataId.estado,
    });

    return dataId;
  }
}
