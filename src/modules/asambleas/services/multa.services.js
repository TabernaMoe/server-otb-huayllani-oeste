import { multaModel } from '../../../models/asamblea/multa.model.js';

export class MultaServices {
  static async getId(id) {
    const data = await multaModel.findByPk(id, { raw: true });
    if (!data) {
      const err = new Error('No se encontro la multa');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async update(id, payload) {
    const { monto_multa } = payload;
    const data = await multaModel.findByPk(id, { raw: true });
    if (!data) {
      const err = new Error('No se encontro la multa');
      err.statusCode = 404;
      throw err;
    }
    await data.update({ monto_multa });
    return data;
  }
}
