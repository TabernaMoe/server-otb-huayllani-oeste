import { EgresosModel } from '../../../models/egresos/egresos.model.js';

export class EgresosRespository {
  static async getAll() {
    const data = await EgresosModel.findAll({ raw: true });
    return data;
  }
  static async getById({ id }) {
    const data = await EgresosModel.findByPk(id);
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload }) {
    const data = await EgresosModel.create(payload);
    return data;
  }
  static async update({ id, payload }) {
    const data = await EgresosModel.findByPk(id);
    if (!data) {
      return null;
    }
    await data.update(payload);
    return data;
  }
}
