import { col, fn } from 'sequelize';
import { accionModel } from '../../../models/accion/accion.model.js';
import { socioModel } from '../../../models/socio.model.js';

export class AccionRepository {
  static async getById({ id, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction });
    return !data ? null : data;
  }
  static async getSelectByServicio({ tipo_servicio }) {
    if (!tipo_servicio) {
      return [];
    }

    const data = await accionModel.findAll({
      attributes: [
        ['id', 'value'],
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('codigo_interno'),
            col('socioAccion.nombres'),
            col('socioAccion.primer_apellido'),
            col('socioAccion.segundo_apellido'),
          ),
          'label',
        ],
      ],
      where: {
        tipo_servicio,
      },
      include: [
        {
          model: socioModel,
          as: 'socioAccion',
          attributes: [],
        },
      ],
      raw: true,
    });

    return data;
  }
}
