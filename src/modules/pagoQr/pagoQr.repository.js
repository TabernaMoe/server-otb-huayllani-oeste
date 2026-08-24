import { pagoQrModel } from './pagoQr.model.js';

export class PagoQrRepository {
  static async findAll({ page = 1, limit = 10, estado }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (estado) {
      where.estado = estado;
    }

    return pagoQrModel.findAndCountAll({
      where,

      /*
       * MUY IMPORTANTE:
       *
       * No mandar Base64 de todos
       * los QR en el listado.
       */
      attributes: {
        exclude: ['qr_image'],
      },

      limit,

      offset,

      order: [['createdAt', 'DESC']],
    });
  }
  static async create(data, options = {}) {
    return pagoQrModel.create(data, options);
  }

  static async findById(id, options = {}) {
    return pagoQrModel.findByPk(id, options);
  }

  static async findByQrId(qrId, options = {}) {
    return pagoQrModel.findOne({
      where: {
        qr_id: qrId,
      },
      ...options,
    });
  }

  static async findByTransactionId(transactionId, options = {}) {
    return pagoQrModel.findOne({
      where: {
        transaction_id: transactionId,
      },
      ...options,
    });
  }

  static async updateById(id, data, options = {}) {
    const [updated] = await pagoQrModel.update(data, {
      where: {
        id,
      },
      ...options,
    });

    return updated;
  }
}
