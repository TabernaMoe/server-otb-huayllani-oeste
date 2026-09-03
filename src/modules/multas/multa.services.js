import { Op } from 'sequelize';
import { multaModel } from '../../models/multas.model.js';

export class MultaServices {
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
          nombre_multa: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await multaModel.findAndCountAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
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
  static async getSelect(search) {
    search = search?.trim() || '';

    let where = { estado: true };
    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            nombre_multa: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      };
    }

    const data = await multaModel.findAll({
      where,
      attributes: [
        ['id', 'value'],
        ['nombre_multa', 'label'],
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async create(payload) {
    const { nombre_multa, precio } = payload;
    const nombreExiste = await multaModel.findOne({
      where: {
        nombre_multa,
      },
    });
    if (nombreExiste) {
      const err = new Error('ya existe una multa con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const data = await multaModel.create({ nombre_multa, precio });

    return data.toJSON();
  }
  static async update(id, payload) {
    const { nombre_multa, precio } = payload;

    const data = await multaModel.findByPk(id);
    if (!data) {
      const err = new Error('No se encontro la multa');
      err.statusCode = 404;
      throw err;
    }
    let dataSave = {};
    if (nombre_multa) {
      const nombreExiste = await multaModel.findOne({
        where: {
          nombre_multa,
        },
      });
      if (nombreExiste) {
        const err = new Error('ya existe una multa con ese nombre');
        err.statusCode = 409;
        throw err;
      }
      dataSave.nombre_multa = nombre_multa;
    }
    if (precio) {
      dataSave.precio = precio;
    }
    if (Object.keys(dataSave).length === 0) {
      const err = new Error('Debe enviar al menos un valor');
      err.statusCode = 404;
      throw err;
    }
    await data.update(dataSave);

    return data.toJSON();
  }
  static async changeStatus(id) {
    const dataId = await multaModel.findByPk(id);
    if (!dataId) {
      const err = new Error('No se encotro la multa');
      err.statusCode = 404;
      throw err;
    }

    dataId.estado = !dataId.estado;

    await dataId.save();

    return;
  }
}
