import { Op } from 'sequelize';
import { cobroModel } from '../../../models/cobros/cobro.model.js';

export class CobroRepository {
  static async create({ payload, transaction = null }) {
    const data = await cobroModel.create(payload, { transaction });
    return data;
  }
  static async createByArray({ payload = [], transaction = null }) {
    const data = await cobroModel.bulkCreate(payload, { transaction });
    return data;
  }
  static async deleteByArray({ payload, transaction = null }) {
    if (!Array.isArray(payload) || payload.length === 0) return null;

    const eliminados = await cobroModel.destroy({
      where: {
        id: {
          [Op.in]: payload,
        },
        estado: 'PENDIENTE',
      },
      //returning: true, devolver registro eliminados
      transaction,
    });

    return eliminados;
  }
}
