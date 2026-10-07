import { lecturaAguaModel } from '../../models/lecturasAgua/lecturasAgua.model.js';

export class LecturaAguaRepository {
  static async getById({ id, transaction = null }) {
    const data = await lecturaAguaModel.findByPk(id, {
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getLecturasByAccion({ accion_id, transaction = null }) {
    const data = await lecturaAguaModel.findAll({
      attributes: {
        exclude: [
          'periodo_id',
          'accion_id',
          'estado',
          'createdAt',
          'updatedAt',
        ],
      },
      where: {
        accion_id,
      },
      transaction,
    });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await lecturaAguaModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });

    return data;
  }
}
