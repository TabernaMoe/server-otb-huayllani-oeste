import { pagoModel } from '../../../models/cobros/pago.model.js';

export class PagoAguaRepository {
  static async create({ payload, transaction = null }) {
    const data = await pagoModel.create(payload, { transaction });
    return data;
  }
}
