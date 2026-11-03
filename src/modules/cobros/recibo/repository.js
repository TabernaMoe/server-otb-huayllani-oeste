import { reciboModel } from '../../../models/cobros/recibo.model.js';

export class ReciboRepository {
  static async create({ payload, transaction = null }) {
    const data = await reciboModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await reciboModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
