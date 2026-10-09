import { cobroAccionAlcantarilladoModel } from '../../../../models/accionAlcantarillado/cobroAlcantarillado/tipoCobros/cobroAccionAlcantarillado.model.js';

export class tipoCobroAlcantarillado {
  static async createAccionAlcantarillado({ payload, transaction = null }) {
    const data = await cobroAccionAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
}
