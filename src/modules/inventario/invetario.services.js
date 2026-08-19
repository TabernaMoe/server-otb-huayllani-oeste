import { Op } from 'sequelize';
import { inventarioModel } from '../../models/inventario.model.js';

export class InventarioServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_producto: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await inventarioModel.findAndCountAll({
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
    const { nombre_producto } = payload;
    const nombreExit = await inventarioModel.findOne({ nombre_producto });
    if (nombreExit) {
      const err = new Error('Ya existe un producto con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const dataCreated = await inventarioModel.create({
      ...payload,
      saldo_anterior: payload.saldo_actual,
    });
  }
  static async update(id, payload) {
    const { nombre_producto, saldo_actual } = payload;
    const dataSearch = await inventarioModel.findByPk(id);
    if (!dataSearch) {
      const err = new Error('No se encontro el registro');
      err.statusCode = 404;
      throw err;
    }
    let dataSaved = {};
    if (nombre_producto) {
      dataSaved.nombre_producto = nombre_producto;
    }
    if (saldo_actual) {
      dataSaved.saldo_actual = Number(dataSearch.saldo_actual + saldo_actual);
    }
    await dataSearch.update(dataSaved);
    return dataSearch;
  }
  static async sumar(id) {
    const registro = await inventarioModel.findByPk(id);

    if (!registro) {
      const err = new Error('Registro no econtrado');
      err.statusCode = 403;
      throw err;
    }
    if ((registro.saldo_actual ?? 0) <= 0) {
      const err = new Error('No hay saldo disponible para descontar');
      err.statusCode = 409;
      throw err;
    }

    await registro.increment('salida', { by: 1 });

    await registro.decrement('saldo_actual', { by: 1 });

    return;
  }
  static async restar(id) {
    const registro = await inventarioModel.findByPk(id);

    if (!registro) {
      const err = new Error('Registro no econtrado');
      err.statusCode = 403;
      throw err;
    }
    if (registro.saldo_actual >= registro.saldo_anterior) {
      const err = new Error('No se puede añadir mas que el saldo anterior');
      err.statusCode = 409;
      throw err;
    }
    await registro.decrement('salida', { by: 1 });
    await registro.increment('saldo_actual', { by: 1 });

    return;
  }
}
