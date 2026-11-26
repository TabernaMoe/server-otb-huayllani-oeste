import { lecturaAguaModel } from '../../../models/lecturasAgua/lecturasAgua.model.js';
import { accionModel } from '../../../models/accion/accion.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { tarifaModel } from '../../../models/tarifa/tarifa.model.js';
import { fn, col } from 'sequelize';

export class LecturaRespository {
  static async getAll() {
    const data = await accionModel.findAll({
      attributes: {
        exclude: [
          'socio_id',
          'calle_id',
          'tarifa_id',
          'createdAt',
          'updatedAt',
        ],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col('socioAccion.nombres'),
              col('socioAccion.primer_apellido'),
              col('socioAccion.segundo_apellido'),
            ),
            'nombre_completo',
          ],
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
      },
      include: [
        { model: socioModel, as: 'socioAccion', attributes: [] },
        { model: calleRamalModel, as: 'calleAccion', attributes: [] },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: lecturaAguaModel,
          as: 'lecturas',
          attributes: [
            'lectura_anterior',
            'lectura_actual',
            'consumo_m3',
            'precio',
            'periodo',
          ],
          separate: true,
          limit: 1,
          order: [['id', 'DESC']],
        },
      ],

      order: [['id', 'DESC']],
      subQuery: false,
      distinct: true,
    });
    return data;
  }
  static async getUltimaLectura({ accion_id, transaction = null }) {
    const data = await lecturaAguaModel.findOne({
      where: {
        accion_id,
      },
      order: [['id', 'DESC']],
    });
    return !data ? null : data;
  }
  static async getLecturaByPeriodo({
    accion_id,
    periodo_id,
    transaction = null,
  }) {
    const data = await lecturaAguaModel.findOne({
      where: {
        accion_id,
        periodo_id,
      },
      transaction,
    });
    return !data ? null : data;
  }
  static async create({ payload, transaction = null }) {
    const data = await lecturaAguaModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, transaction = null }) {
    const data = await lecturaAguaModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });

    return data;
  }
}
