import { col } from 'sequelize';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { socioModel } from '../../models/socio.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';

export class CobroServices {
  static async getAll() {
    const data = cobroModel.findAll({
      attributes: {
        include: [
          [col('socioCobro.nombres'), 'nombres'],
          [col('socioCobro.primer_apellido'), 'primer_apellido'],
          [col('socioCobro.segundo_apellido'), 'segundo_apellido'],
          [col('periodo.mes'), 'periodo'],
        ],
      },
      include: [
        {
          model: socioModel,
          as: 'socioCobro',
          attributes: [],
        },
        {
          model: periodoModel,
          as: 'periodo',
          attributes: [],
        },
      ],
    });
    return data;
  }
}
