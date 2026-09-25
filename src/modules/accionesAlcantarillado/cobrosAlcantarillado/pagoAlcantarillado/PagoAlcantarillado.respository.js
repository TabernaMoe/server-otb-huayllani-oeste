import { pagoAlcantarilladoModel } from '../../../../models/accionAlcantarillado/cobroAlcantarillado/pagoAlcantarillado.model.js';

export class PagoAlcantarilladoRepository {
  static async create({ payload, transaction = null }) {
    const data = await pagoAlcantarilladoModel.create(payload, { transaction });
    return data;
  }
}
