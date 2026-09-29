import { accionModel } from '../../../models/accion/accion.model.js';

export class AccionAguaAlcantarillado {
  static async udpate({ id, payload, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
