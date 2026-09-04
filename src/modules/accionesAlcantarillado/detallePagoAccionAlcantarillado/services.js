import { col, Op } from 'sequelize';

import {
  accionAlcantarilladoDetalle,
  detallePagoAccionAlcantarillado,
} from '../../../models/accionAlcantarillado/detallePagoAccionAlcantarillado.model.js';

export class Services {
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

    const { count, rows } =
      await detallePagoAccionAlcantarillado.findAndCountAll({
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
  static async getSelect() {
    const datos = await detallePagoAccionAlcantarillado.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_accion', 'label'],
      ],
    });

    return datos;
  }
  static async getId(id) {
    const datoId = await detallePagoAccionAlcantarillado.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true,
    });
    if (!datoId) {
      const err = new Error('No se encontro el detalle pago accion');
      err.statusCode = 404;
      throw err;
    }
    return datoId;
  }
  static async create(payload) {
    const { nombre_accion, ...parent } = payload;

    const detalleSearch = await detallePagoAccionAlcantarillado.findOne({
      where: {
        nombre_accion,
      },
    });
    if (detalleSearch) {
      const err = new Error('Ya hay un detalle accion con ese nombre');
      err.statusCode = 400;
      throw err;
    }

    const dataCreated = await detallePagoAccionAlcantarillado.create({
      ...parent,
      nombre_accion,
    });
    return dataCreated;
  }
  static async update(id, payload) {
    const { nombre_accion, precio_accion, tipo_cobro } = payload;
    const dataSearch = await detallePagoAccionAlcantarillado.findByPk(id);
    if (!dataSearch) {
      const err = new Error('No exite el detalle accion');
      err.statusCode = 404;
      throw err;
    }

    let data = {};

    if (nombre_accion) {
      const Duplicate = await detallePagoAccionAlcantarillado.findOne({
        where: {
          nombre_accion,
        },
      });

      if (Duplicate) {
        const err = new Error('Ya existe un nombre con esa accion');
        err.statusCode = 403;
        throw err;
      }
      data.nombre_accion = nombre_accion;
    }
    if (precio_accion) {
      data.precio_accion = precio_accion;
    }
    if (tipo_cobro) {
      data.tipo_cobro = tipo_cobro;
    }
    await dataSearch.update(data);
    return dataSearch;
  }
  static async cambiarEstado(id) {
    const dataSearch = await detallePagoAccionAlcantarillado.findByPk(id);
    if (!dataSearch) {
      const err = new Error('El detalle accion no existe');
      err.statusCode = 404;
      throw err;
    }
    if (dataSearch.estado === true) {
      const accionAsociada = await accionAlcantarilladoDetalle.findOne({
        where: { detalle_alcantarillado_id: id },
      });

      if (accionAsociada) {
        const err = new Error(
          'No se puede desactivar la calle, tiene acciones asociadas',
        );
        err.statusCode = 409;
        throw err;
      }
    }
    dataSearch.estado = !dataSearch.estado;

    await dataSearch.save();
    return;
  }
}
