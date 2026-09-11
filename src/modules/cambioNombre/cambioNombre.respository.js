import { cambiarNombreModel } from '../../models/cambioNombre.model.js';

class CambioNombreRepository {
  static async getAll(page, limit, search, estado) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          socio_antiguo_snapshot: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          socio_nuevo_snapshot: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          tipo: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await cambiarNombreModel.findAndCountAll({
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'socio_nuevo_id',
          'socio_antiguo_id',
          'usuario_id',
        ],
      },
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getById() {}
  static async create({ payload, transaction }) {
    const data = await cambiarNombreModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction }) {}
  static async changeStatus({ id, transaction }) {}
}
export default CambioNombreRepository;
