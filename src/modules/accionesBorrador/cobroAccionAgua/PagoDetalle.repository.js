import { pagoDetalleModel } from '../../../models/cobros/pago.model.js';

export class PagoDetalleAguaRepository {
  static async create({ payload, transaction = null }) {
    const data = await pagoDetalleModel.create(payload, { transaction });
    return data;
  }
}
