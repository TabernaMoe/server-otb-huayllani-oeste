import { cobroAlcantarilladoModel } from '../../../models/accionAlcantarillado/cobroAlcantarillado/cobroAlcantarillado.model.js';

export class CobroAlcantarilladoRepository {
  static async create({ payload, transaction = null }) {
    const data = await cobroAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
}
