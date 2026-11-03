import { reciboModel } from '../../../models/cobros/recibo.model.js';

export class ReciboRepository {
  static async create({ payload, transaction }) {
    const data = await reciboModel.create(payload, { transaction });
    return data;
  }
}
