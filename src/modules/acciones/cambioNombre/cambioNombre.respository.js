import { cambiarNombreModel } from '../../../models/cambioNombre.model.js';

export class CambioNombreRepository {
  static async create({ payload, transaction = null }) {
    const data = await cambiarNombreModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await cambiarNombreModel.findByPk(id, { transaction });
    if (!data) {
      return data;
    }

    await data.update(payload, { transaction });

    return !data ? null : data;
  }
}
