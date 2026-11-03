import { cobroModel } from '../../../models/cobros/cobro.model.js';

export class CobroAccionAguaRepository {
  static async create({ payload, transaction = null }) {
    const data = cobroModel.create(payload, { transaction });
    return data;
  }
}
