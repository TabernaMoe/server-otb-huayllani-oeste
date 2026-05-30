import { Op, Sequelize } from 'sequelize';
import { detallePagoAccion } from '../../../models/accion/detallePagoAccion.model.js';

export class detallePagoAccionServices {
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
          nombre_accion: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await detallePagoAccion.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
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
  static async getAllSelect() {
    const datos = await detallePagoAccion.findAll({
      attributes: ['id', 'nombre_accion'],
    });
    const datosNormalizado = datos.map((row) => ({
      value: row.id,
      label: row.nombre_accion,
    }));

    return datosNormalizado;
  }
  static async getId(id) {
    const datoId = await detallePagoAccion.findByPk(id, { raw: true });
    if (!datoId) {
      const err = new Error('No se encontro el detalle pago accion');
      err.statusCode = 404;
      throw err;
    }
    return datoId;
  }
  static async create(payload) {
    const { nombre_accion, ...parent } = payload;
    const detalleSearch = await detallePagoAccion.findOne({
      where: {
        nombre_accion,
      },
    });
    if (detalleSearch) {
      const err = new Error('Ya hay un detalle accion con ese nombre');
      err.statusCode = 400;
      throw err;
    }

    const dataCreated = await detallePagoAccion.create({
      ...parent,
      nombre_accion,
    });
    return dataCreated;
  }
  static async update(id, payload) {
    const dataSearch = await detallePagoAccion.findByPk(id);
    const { nombre_accion } = payload;
    if (!dataSearch) {
      const err = new Error('No exite el detalle accion');
      err.statusCode = 404;
      throw err;
    }
    if (nombre_accion) {
      const Duplicate = await detallePagoAccion.findOne({
        where: {
          nombre_accion,
        },
      });
      if (Duplicate && Duplicate.id !== dataSearch.id) {
        const err = new Error('Ya existe un nombre con esa accion');
        err.statusCode = 403;
        throw err;
      }
    }
    await dataSearch.update(payload);
    const dataReload = detallePagoAccion.findByPk(dataSearch.id, { raw: true });
    return dataReload;
  }
  static async toggleStatus(id) {
    const dataSearch = await detallePagoAccion.findByPk(id);
    if (!dataSearch) {
      const err = new Error('El detalle accion no existe');
      err.statusCode = 404;
      throw err;
    }
    dataSearch.estado = !dataSearch.estado;

    await dataSearch.save();
    return;
  }
  static async delete(id) {
    const dataSearch = await detallePagoAccion.findByPk(id);
    if (!dataSearch) {
      const err = new Error('El detalle accion no existe');
      err.statusCode = 404;
      throw err;
    }
    //validar si esta en uso
    await dataSearch.destroy();
    return;
  }
}
