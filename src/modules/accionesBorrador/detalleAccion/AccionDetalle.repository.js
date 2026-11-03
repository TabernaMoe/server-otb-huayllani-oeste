import { Op } from 'sequelize';

import { detalleAccionModel } from '../../../models/accion/detalleAccion.model.js';

export class detalleAccionRepository {
  static async getByArray({ ids = [], transaction = null }) {
    const data = await detalleAccionModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
      raw: true,
    });
    if (ids.length != data.length) {
      return null;
    }
    return data;
  }
}
