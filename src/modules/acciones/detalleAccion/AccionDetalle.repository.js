import { Op } from 'sequelize';
import { detallePagoAccion } from '../../../models/accion/detallePagoAccion.model.js';

export class detalleAccionRepository {
  static async getByArray({ ids = [], transaction = null }) {
    const data = await detallePagoAccion.findAll({
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
