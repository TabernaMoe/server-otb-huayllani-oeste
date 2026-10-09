import { reciboAlcantarilladoModel } from '../../../../models/accionAlcantarillado/cobroAlcantarillado/reciboAlcantarillado.model.js';

export class ReciboAlcantarilladoRepository {
  static async create({ payload, transaction = null }) {
    const ultimoRecibo = await reciboAlcantarilladoModel.findOne({
      raw: true,
      transaction,
      order: [['id', 'DESC']],
    });
    const { numero_recibo } = ultimoRecibo;
    const data = await reciboAlcantarilladoModel.create(
      { ...payload, numero_recibo: numero_recibo ? numero_recibo + 1 : 1 },
      {
        transaction,
      },
    );
    return data;
  }
}
