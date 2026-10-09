import { periodoModel } from '../../../models/gestiones/periodo.model.js';

export class PeriodoRepository {
  static async getPeriodoActual({ transaction = null }) {
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
  static async getPeriodosPendientes({ transaction = null }) {
    const data = await periodoModel.findAll({
      where: {
        estado: 'PENDIENTE',
      },
      transaction,
      raw: true,
    });
    return data;
  }
}
