import { accionModel } from '../../../models/accion/accion.model.js';

export class AccionRepository {
  static async getById({ id, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction });
    return !data ? null : data;
  }
}
