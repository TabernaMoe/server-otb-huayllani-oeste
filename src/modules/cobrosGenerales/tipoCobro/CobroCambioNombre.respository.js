import { cobroCambioNombreModel } from '../../../models/cobros/tipoCobros/cobroCambioNombre.model.js';

export class CobroCambioNombreRespository {
  static async create({ payload, transaction = null }) {
    const data = await cobroCambioNombreModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await cobroCambioNombreModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
