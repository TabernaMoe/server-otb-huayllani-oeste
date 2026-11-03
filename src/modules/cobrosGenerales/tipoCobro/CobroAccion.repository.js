import { Op } from 'sequelize';
import { cobroAccionModel } from '../../../models/cobros/tipoCobros/cobroAccion.model.js';

export class CobroAccionRespository {
  static async create({ payload, transaction = null }) {
    const data = await cobroAccionModel.create(payload, { transaction });
    return data;
  }
  static async deleteByAccionDetalle({ payload, transaction = null }) {
    const data = await cobroAccionModel.destroy({
      where: {
        accion_detalle_id: {
          [Op.in]: payload,
        },
      },
      transaction,
    });
    return data;
  }

  static async getCobros({ payload, transaction = null }) {
    const data = await cobroAccionModel.findAll({
      attributes: ['cobro_id'],
      where: {
        accion_detalle_id: payload,
      },
      transaction,
      raw: true,
    });
    if (data.length <= 0) {
      return null;
    }

    return data.map((row) => row.cobro_id);
  }
}
