import { col, Op } from 'sequelize';
import { accionDetalleModel } from '../../../models/accion/accionDetalle.model.js';
import { detallePagoAccion } from '../../../models/accion/detallePagoAccion.model.js';
import { cobroAccionModel } from '../../../models/cobros/tipoCobros/cobroAccion.model.js';
import { cobroModel } from '../../../models/cobros/cobro.model.js';

export class AccionDetalleRepository {
  static async createByArray({ accion_id, data, transaction = null }) {
    const accionDetalle = await accionDetalleModel.bulkCreate(
      data.map((row) => ({
        accion_id,
        detalle_pago_accion_id: row,
      })),
      { transaction },
    );
    const idsAccionDetalle = accionDetalle.map((row) => row.toJSON().id);

    const dataDetalle = await accionDetalleModel.findAll({
      attributes: [
        'id',
        [col('detalleAccionAD.nombre_accion'), 'nombre_accion'],
        [col('detalleAccionAD.precio_accion'), 'precio_accion'],
      ],
      where: {
        id: idsAccionDetalle,
      },
      include: [
        {
          model: detallePagoAccion,
          as: 'detalleAccionAD',
          attributes: [],
        },
      ],
      raw: true,
      transaction,
    });
    return dataDetalle;
  }
  static async getCambios({ accion_id, dataNew = [], transaction = null }) {
    const dataOld = await accionDetalleModel.findAll({
      attributes: [
        'id',
        ['detalle_pago_accion_id', 'detalle_id'],
        [col('detalleAccionAD.nombre_accion'), 'nombre_accion'],
        [col('detalleAccionAD.precio_accion'), 'precio_accion'],
      ],
      where: {
        accion_id,
      },
      include: [
        {
          model: detallePagoAccion,
          as: 'detalleAccionAD',
          attributes: [],
        },
      ],
      raw: true,
      transaction,
    });

    const idsNew = new Set(dataNew.map(Number));

    const idsOld = new Set(dataOld.map((row) => Number(row.detalle_id)));

    const idsRemove = dataOld
      .filter((row) => !idsNew.has(Number(row.detalle_id)))
      .map((row) => row.id);

    const idsAdd = dataNew.map(Number).filter((id) => !idsOld.has(id));

    return {
      idsRemove,
      idsAdd,
    };
  }
  static async deleteArray({ data = [], transaction = null }) {
    const buscarCobros = await cobroAccionModel.findAll({
      attributes: [
        'id',
        'cobro_id',
        [col('accionCobroDetalle.estado'), 'estado_cobro'],
      ],
      where: {
        accion_detalle_id: {
          [Op.in]: data,
        },
      },
      include: [
        {
          model: cobroModel,
          as: 'accionCobroDetalle',
          attributes: [],
        },
      ],
      transaction,
      raw: true,
    });

    // 3. Verificar si existe algún cobro iniciado
    const hayCobroComenzado = buscarCobros.some(
      (row) => row.estado_cobro === 'PAGADO' || row.estado_cobro === 'PARCIAL',
    );

    if (hayCobroComenzado) {
      return null;
    }

    // 4. Eliminar relación cobro - acción detalle
    await cobroAccionModel.destroy({
      where: {
        accion_detalle_id: {
          [Op.in]: data,
        },
      },
      transaction,
    });
    // 5. Obtener los IDs de los cobros
    const idsCobros = buscarCobros.map((row) => row.cobro_id);

    // 6. Eliminar cobros
    if (idsCobros.length > 0) {
      await cobroModel.destroy({
        where: {
          id: {
            [Op.in]: idsCobros,
          },
        },
        transaction,
      });
    }

    // 7. Eliminar los detalles de la acción
    await accionDetalleModel.destroy({
      where: {
        id: {
          [Op.in]: data,
        },
      },
      transaction,
    });

    return true;
  }
}
