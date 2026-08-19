import { calleRamalModel } from '../../models/calleRamal.model.js';
import { accionModel } from '../../models/accion/accion.model.js';
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
          nombre_calle: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await calleRamalModel.findAndCountAll({
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
            nombre_calle: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      };
    }

    const data = await calleRamalModel.findAll({
      where,
      attributes: [
        ['id', 'value'],
        ['nombre_calle', 'label'],
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async getId(id) {
    const datoId = await calleRamalModel.findByPk(id, { raw: true });
    if (!datoId) {
      const err = new Error('No se encontro la calle');
      err.statusCode = 404;
      throw err;
    }
    return datoId;
  }
  static async create(payload) {
    const { nombre_calle } = payload;

    const calleSearch = await calleRamalModel.findOne({
      where: {
        nombre_calle,
      },
    });

    if (calleSearch) {
      const err = new Error('Ya existe una calle con ese nombre');
      err.statusCode = 400;
      throw err;
    }

    const created = await calleRamalModel.create({ nombre_calle });
    return created;
  }
  static async update(id, payload) {
    const { nombre_calle } = payload;

    const calleUpdate = await calleRamalModel.findByPk(id);

    if (!calleUpdate) {
      const err = new Error('No exites la calle');
      err.statusCode = 400;
      throw err;
    }

    const calleSearch = await calleRamalModel.findOne({
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
  static async cambiarEstado(id) {
    const dataId = await calleRamalModel.findByPk(id);
    if (!dataId) {
      const err = new Error('No se encotro la calle');
      err.statusCode = 404;
      throw err;
    }
    if (dataId.estado === true) {
      const accionAsociada = await accionModel.findOne({
        where: { calle_id: id },
      });

      if (accionAsociada) {
        const err = new Error(
          'No se puede desactivar la calle, tiene acciones asociadas',
        );
        err.statusCode = 409;
        throw err;
      }
    }

    dataId.estado = !dataId.estado;

    await dataId.save();

    return;
  }
}
