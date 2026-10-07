import { rangoTarifaModel } from '../../models/tarifa/rango.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';

export class TarifaRespository {
  static async getTarifaById({ id, transaction = null }) {
    const data = await tarifaModel.findByPk(id, {
      include: [
        {
          model: rangoTarifaModel,
          as: 'rangosTarifa',
          separate: true,
          order: [['consumo_minimo', 'ASC']],
        },
      ],
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
}
