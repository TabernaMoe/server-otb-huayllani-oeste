import { calleRamalModel } from '../../models/calleRamal.model.js';

export class CalleRepository {
  static async getById({ id, transaction }) {
    const data = await calleRamalModel.findByPk(id, {
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getSelect({ search = '' }) {
    let where = {};

    if (search) {
      where[Op.or] = [
        {
          nombre_calle: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }
    const data = await calleRamalModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_calle', 'label'],
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
}
