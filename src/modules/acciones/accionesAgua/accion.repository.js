import { Op, fn, col } from 'sequelize';
import { accionModel } from '../../../models/accion/accion.model.js';
import { lecturaAguaModel } from '../../../models/lecturasAgua/lecturasAgua.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { tarifaModel } from '../../../models/tarifa/tarifa.model.js';

export class AccionAguaAlcantarillado {
  static async udpate({ id, payload, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async getAccionById({ id, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction, raw: true });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getAccionesWithMora({ transaction = null } = {}) {
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
              col(`socioAccion.nombres`),
              col(`socioAccion.primer_apellido`),
              col(`socioAccion.segundo_apellido`),
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
          where: {
            mora: {
              [Op.gt]: 0,
            },
          },
          transaction,
        },
      ],
    });

    const dataNomr = data.map((row) => ({
      ...row.toJSON(),
      mora_total: row.lecturas.reduce(
        (acc, item) => acc + Number(item.mora || 0),
        0,
      ),
      lecturas: undefined,
    }));
    return dataNomr;
  }
}
