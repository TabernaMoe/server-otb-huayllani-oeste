import { socioModel } from '../../../models/socio.model.js';
import { accionModel } from '../../../models/acciones/accion.model.js';
import { cobroModel } from '../../../models/cobro.model.js';

export class cobroServices {
  static async getAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [{ nombre_calle: { [Op.iLike]: `%${search}%` } }];
    }

    const { count, rows } = await cobroModel.findAndCountAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      where,
      limit,
      offset,
      include: [{ model: socioModel, as: 'socio_cobro' }],
      order: [['id', 'DESC']],
      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: dataPlana,
    };
  }
}
