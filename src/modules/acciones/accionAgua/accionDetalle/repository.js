import { col, Op } from 'sequelize';
import { accionDetalleModel } from '../../../../models/accion/accionDetalle.model.js';
import { detalleAccionModel } from '../../../../models/accion/detalleAccion.model.js';

export class AccionDetalleRepository {
  static async createByArray({ payload, transaction = null }) {
    const data = await accionDetalleModel.bulkCreate(payload, { transaction });
    return data;
  }
  static async getAccionDetalleWithDetalle({ accion_id, transaction = null }) {
    const data = await accionDetalleModel.findAll({
      attributes: [
        'id',
        [col('detalleAccionAD.nombre_accion'), 'nombre_accion'],
        [col('detalleAccionAD.precio_accion'), 'precio_accion'],
      ],
      where: {
        accion_id,
      },
      include: [{ model: detalleAccionModel, as: 'detalleAccionAD' }],
      transaction,
      raw: true,
    });
    return data;
  }
  static async getCambios({ accion_id, detallesAccion, transaction = null }) {
    const dataAnterior = await accionDetalleModel.findAll({
      attributes: ['id', 'detalle_accion_id'],
      where: {
        accion_id,
      },
      transaction,
      raw: true,
    });

    const idsNuevosSet = new Set(detallesAccion.map(Number));
    const idsActualesSet = new Set(
      dataAnterior.map((r) => r.detalle_accion_id),
    );

    const aEliminar = dataAnterior
      .filter((r) => !idsNuevosSet.has(r.detalle_accion_id))
      .map((r) => r.id);

    const aAgregar = [...idsNuevosSet].filter((id) => !idsActualesSet.has(id));

    return { aEliminar, aAgregar };
  }
  static async deleteByArray({ payload, transaction = null }) {
    const data = await accionDetalleModel.destroy({
      where: {
        id: {
          [Op.in]: payload,
        },
      },
      transaction,
    });
    console.log(data);

    if (data == 0) {
      return null;
    }
    return data;
  }
}
