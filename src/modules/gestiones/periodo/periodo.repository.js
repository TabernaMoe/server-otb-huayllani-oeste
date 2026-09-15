import { periodoModel } from '../../../models/gestiones/periodo.model.js';

export class PeriodoRepository {
  static async getPeriodoActual({ transaction }) {
    const data = await periodoModel.findOne({
      where: {
        estado: 'ACTIVO',
      },
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
}
