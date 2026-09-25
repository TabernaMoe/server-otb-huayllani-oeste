import { reciboAlcantarilladoModel } from '../../../../models/accionAlcantarillado/cobroAlcantarillado/reciboAlcantarillado.model.js';

export class ReciboAlcantarilladoRepository {
  static async create({ payload, transaction = null }) {
    const data = await reciboAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
}
