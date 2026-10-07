import { reciboAguaModel } from '../../../models/cobroAgua/recibo.mode.js';

export class ReciboAguaRepository {
  static async update({ id, payload, transaction = null }) {
    const data = await reciboAguaModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
