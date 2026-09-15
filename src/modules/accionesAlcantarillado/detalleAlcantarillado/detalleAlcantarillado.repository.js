import { Op, col } from 'sequelize';
import {
  detalleAlcantarilladoModel,
  accionDetalleAlcantarilladoModel,
} from '../../../models/accionAlcantarillado/detalleAlcantarillado.model.js';

import { cobroAccionAlcantarilladoModel } from '../../../models/accionAlcantarillado/cobroAlcantarillado/tipoCobros/cobroAccionAlcantarillado.model.js';
import { cobroAlcantarilladoModel } from '../../../models/accionAlcantarillado/cobroAlcantarillado/cobroAlcantarillado.model.js';

export class DetalleAlcantarilladoRepository {
  static async getAll({
    page = 1,
    limit = 10,
    search = '',
    estado = undefined,
  }) {
    const offset = (page - 1) * limit;

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

    const { count, rows } = await detalleAlcantarilladoModel.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where,
      limit,
      offset,

      order: [['id', 'DESC']],
      raw: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getSelect({ search = '' }) {
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_accion: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }
    const data = await detalleAlcantarilladoModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_accion', 'label'],
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async getById({ id, transaction = null }) {
    const data = await detalleAlcantarilladoModel.findByPk(id, {
      raw: true,
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getByNombre({ nombre_accion, transaction = null }) {
    const data = await detalleAlcantarilladoModel.findOne({
      where: {
        nombre_accion,
      },
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload, transaction = null }) {
    const data = await detalleAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await detalleAlcantarilladoModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async changeStatus({ id, transaction = null }) {
    const data = await detalleAlcantarilladoModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await detalleAlcantarilladoModel.update(
      { estado: !data.estado },
      { transaction },
    );
    return data;
  }
  static async asignarDetallesAccion({
    idAccion,
    detalles = [],
    transaction = null,
  }) {
    const data = await detalleAlcantarilladoModel.findAll({
      where: {
        id: {
          [Op.in]: detalles,
        },
      },
      transaction,
      raw: true,
    });

    if (detalles.length !== data.length) {
      return null;
    }

    const accionDetalle = await accionDetalleAlcantarilladoModel.bulkCreate(
      data.map((row) => ({
        accion_alcantarillado_id: idAccion,
        detalle_alcantarillado_id: row.id,
      })),
      { transaction },
    );
    const idsAccionDetalle = accionDetalle.map((row) => row.toJSON().id);

    const dataDetalle = await accionDetalleAlcantarilladoModel.findAll({
      attributes: [
        'id',
        [col('detallesADA.nombre_accion'), 'nombre_accion'],
        [col('detallesADA.precio_accion'), 'precio_accion'],
      ],
      where: {
        id: idsAccionDetalle,
      },
      include: [
        {
          model: detalleAlcantarilladoModel,
          as: 'detallesADA',
          attributes: [],
        },
      ],
      raw: true,
      transaction,
    });
    return dataDetalle;
  }
  static async editarDetallesAccion({
    idAccion,
    detalles = [],
    transaction = null,
  }) {
    const dataNew = await detalleAlcantarilladoModel.findAll({
      where: {
        id: {
          [Op.in]: detalles,
        },
      },
      transaction,
      raw: true,
    });

    if (dataNew.length !== dataNew.length) {
      return null;
    }

    const dataOld = await accionDetalleAlcantarilladoModel.findAll({
      attributes: [
        'id',
        [col('detallesADA.id'), 'detalle_id'],
        [col('detallesADA.nombre_accion'), 'nombre_accion'],
        [col('detallesADA.precio_accion'), 'precio_accion'],
      ],
      where: {
        accion_alcantarillado_id: idAccion,
      },
      include: [
        {
          model: detalleAlcantarilladoModel,
          as: 'detallesADA',
          attributes: [],
        },
      ],
      raw: true,
      transaction,
    });

    const idsNew = dataNew.map((row) => row.id);
    const idsSetNew = new Set(idsNew);
    const dataDelete = dataOld.filter((row) => !idsSetNew.has(row.detalle_id));

    const idsOld = dataOld.map((row) => row.detalle_id);
    const idsSetOld = new Set(idsOld);
    const dataAdd = dataNew.filter((row) => !idsSetOld.has(row.id));

    const idsRemove = dataDelete.map((row) => row.id);

    const idsAdd = dataAdd.map((row) => row.id);

    return { idsRemove, idsAdd };
  }
  static async eliminarDetallesAccion({ detalles = [], transaction = null }) {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return null;
    }

    // 1. Verificar que todos los detalles existan
    const buscarAccionDetalles = await accionDetalleAlcantarilladoModel.findAll(
      {
        where: {
          id: {
            [Op.in]: detalles,
          },
        },
        raw: true,
        transaction,
      },
    );

    if (detalles.length !== buscarAccionDetalles.length) {
      return null;
    }

    // 2. Buscar los cobros asociados
    const buscarCobros = await cobroAccionAlcantarilladoModel.findAll({
      attributes: [
        'id',
        'cobro_id',
        [col('cobroAlcantarillado.estado'), 'estado_cobro'],
      ],
      where: {
        accion_detalle_alcantarillado_id: {
          [Op.in]: detalles,
        },
      },
      include: [
        {
          model: cobroAlcantarilladoModel,
          as: 'cobroAlcantarillado',
          attributes: [],
        },
      ],
      raw: true,
      transaction,
    });

    // 3. Verificar si existe algún cobro iniciado
    const hayCobroComenzado = buscarCobros.some(
      (row) => row.estado_cobro === 'PAGADO' || row.estado_cobro === 'PARCIAL',
    );

    if (hayCobroComenzado) {
      return null;
    }

    // 4. Eliminar relación cobro - acción detalle
    await cobroAccionAlcantarilladoModel.destroy({
      where: {
        accion_detalle_alcantarillado_id: {
          [Op.in]: detalles,
        },
      },
      transaction,
    });

    // 5. Obtener los IDs de los cobros
    const idsCobros = buscarCobros.map((row) => row.cobro_id);

    // 6. Eliminar cobros
    if (idsCobros.length > 0) {
      await cobroAlcantarilladoModel.destroy({
        where: {
          id: {
            [Op.in]: idsCobros,
          },
        },
        transaction,
      });
    }

    // 7. Eliminar los detalles de la acción
    await accionDetalleAlcantarilladoModel.destroy({
      where: {
        id: {
          [Op.in]: detalles,
        },
      },
      transaction,
    });

    return true;
  }
}
