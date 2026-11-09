import { cambioMedidor } from '../../../models/lecturasAgua/cambioMedidor.model.js';

export class CambioMedidorRepository {
  static async create({ payload, transaction = null }) {
    const data = await cambioMedidor.create(payload, { transaction });
    return data;
  }
  static async getByLectura({ lectura_agua_id, transaction = null }) {
    const data = await cambioMedidor.findOne({
      where: {
        lectura_agua_id: lectura_agua_id,
      },
      transaction,
      order: [['id', 'DESC']],
    });
    return data;
  }
}
