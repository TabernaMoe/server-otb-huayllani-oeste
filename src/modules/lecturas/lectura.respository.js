import { lecturaAguaModel } from '../../models/lecturasAgua/lecturasAgua.model.js';
import { cambioMedidor } from '../../models/lecturasAgua/cambioMedidor.model.js';

export class LecturaAguaRepository {
  static async getById({ id, transaction = null }) {
    const data = await lecturaAguaModel.findByPk(id, { transaction });
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
      transaction,
    });
    return data;
  }
  static async UpdateLectura({ id, payload, transaction = null }) {
    const data = await lecturaAguaModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });

    return data;
  }
}
