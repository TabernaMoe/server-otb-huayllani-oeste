import { socioModel } from '../../models/socio.model.js';

export class SocioRepository {
  static async getById({ id, transaction }) {
    const data = await socioModel.findByPk(id, {
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
}
