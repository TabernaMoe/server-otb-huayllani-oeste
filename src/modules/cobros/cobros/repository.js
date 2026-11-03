import { cobroModel } from '../../../models/cobros/cobro.model.js';

export class CobroRepository {
  static async create({ payload, transaction = null }) {
    const data = await cobroModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await cobroModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
