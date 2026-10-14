import { CategoriaGastosModel } from '../../../models/egresos/categoriaGasto.model.js';

export class CategoriaGastosRespository {
  static async getAll() {
    const data = await CategoriaGastosModel.findAll({ raw: true });
    return data;
  }
  static async getById({ id }) {
    const data = await CategoriaGastosModel.findByPk(id);
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload }) {
    const data = await CategoriaGastosModel.create(payload);
    return data;
  }
  static async update({ id, payload }) {
    const data = await CategoriaGastosModel.findByPk(id);
    if (!data) {
      return null;
    }
    await data.update(payload);
    return data;
  }
  static async getSelect() {
    const data = await CategoriaGastosModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_gasto', 'label'],
      ],
    });
    return data;
  }
}
