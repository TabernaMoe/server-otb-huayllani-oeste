import { pagoAguaModel } from '../../../models/cobroAgua/pagoAgua.model.js';

export class PagoAguaRepository {
  static async update({ id, payload, transaction = null }) {
    const data = await pagoAguaModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });

    return data;
  }
}
