import { pagoDetalleAlcantarilladoModel } from '../../../../models/accionAlcantarillado/cobroAlcantarillado/pagoAlcantarillado.model.js';

export class PagoDetalleAlcantarilladoRepository {
  static async create({ payload, transaction = null }) {
    const data = await pagoDetalleAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
  static async createArray({ payload, transaction = null }) {
    const data = await pagoDetalleAlcantarilladoModel.bulkCreate(payload, {
      transaction,
    });
    return data;
  }
}
