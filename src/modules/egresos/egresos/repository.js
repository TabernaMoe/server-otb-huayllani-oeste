import { EgresosModel } from '../../../models/egresos/egresos.model.js';

export class EgresosRespository {
  static async getAll() {
    const data = await EgresosModel.findAll({ raw: true });
    return data;
  }
  static async getById({ id }) {
    const data = await EgresosModel.findByPk(id);
    return !data ? null : data;
  }
  static async create({ payload }) {
    const data = await EgresosModel.create(payload);
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await EgresosModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async changeStatus({ id, transaction = null }) {
    const data = await EgresosModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update({ estado: !payload.estado }, { transaction });
    return data;
  }
}
