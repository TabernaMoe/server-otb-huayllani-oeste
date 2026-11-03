import { cobroAccionModel } from '../../../../models/cobros/tipoCobros/cobroAccion.model.js';

export class TipoCobroRepository {
  static async createAccionDetalle({ payload, transaction = null }) {
    const data = await cobroAccionModel.create(payload, { transaction });
    return data;
  }
}
