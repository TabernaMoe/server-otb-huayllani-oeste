import { pagoModel } from '../../../models/cobros/pago.model.js';

export class PagoRepository {
  static async create({ payload, transaction = nul }) {
    const data = await pagoModel.create(payload, { transaction });
    return data;
  }
}
