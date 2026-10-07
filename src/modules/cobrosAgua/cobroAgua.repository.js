import { cobroAguaModel } from '../../models/cobroAgua/cobroAgua.model.js';

export class CobroAguaRepository {
  static async getByLecturaId({ lectura_id, transaction = null }) {
    const data = await cobroAguaModel.findOne({
      where: {
        lectura_id,
      },
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await cobroAguaModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
