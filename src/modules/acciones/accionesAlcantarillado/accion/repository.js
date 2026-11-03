import { accionModel } from '../../../../models/accion/accion.model.js';
import { detalleAccionModel } from '../../../../models/accion/detalleAccion.model.js';
import { socioModel } from '../../../../models/socio.model.js';
import { tarifaModel } from '../../../../models/tarifa/tarifa.model.js';
import { calleRamalModel } from '../../../../models/calleRamal.model.js';
import { Op, col, fn } from 'sequelize';
import { accionDetalleModel } from '../../../../models/accion/accionDetalle.model.js';
import { cobroAccionModel } from '../../../../models/cobros/tipoCobros/cobroAccion.model.js';
import { cobroModel } from '../../../../models/cobros/cobro.model.js';

export class AccionAlcantarilladoRepository {
  static async getAll() {
    const data = await accionModel.findAll({
      attributes: [
        'id',
        'codigo_interno',
        'estado',
        [col('socioAccion.ci_socio'), 'ci_socio'],
        [
          fn(
            'concat_ws',
            ' ',
            col('socioAccion.nombres'),
            col('socioAccion.primer_apellido'),
            col('socioAccion.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('calleAccion.nombre_calle'), 'nombre_calle'],
        'direccion',
      ],
      include: [
        {
          model: socioModel,
          as: 'socioAccion',
          attributes: [],
        },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: calleRamalModel,
          as: 'calleAccion',
          attributes: [],
        },
        {
          model: detalleAccionModel,
          as: 'detallesAccion',
          through: {
            attributes: [],
          },
        },
      ],
      where: {
        tipo_servicio: 'ALCANTARILLADO',
      },
    });
    return data;
  }
  static async getById({ id, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction });
    return !data ? null : data;
  }
  static async getByIdWithDetallesCobros({ id, transaction }) {
    const data = await accionModel.findByPk(id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'tarifa_id', 'nro_medidor'],
      },
      raw: true,
      transaction,
    });
    if (!data) {
      return null;
    }

    const detallesAccion = await accionDetalleModel.findAll({
      attributes: [
        ['detalle_accion_id', 'id'],
        [col('cobrosAccionDetalle.accionCobroDetalle.estado'), 'estado'],
      ],

      where: { accion_id: id },
      include: [
        // { model: detalleAccionModel, as: 'detalleAccionAD' },
        {
          model: cobroAccionModel,
          as: 'cobrosAccionDetalle',
          attributes: [],
          include: [
            {
              model: cobroModel,
              as: 'accionCobroDetalle',
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });
    return { ...data, detallesAccion };
  }
  static async create({ payload, transaction = null }) {
    const data = await accionModel.create(
      { ...payload, tipo_servicio: 'ALCANTARILLADO' },
      { transaction },
    );
    return data.toJSON();
  }
  static async getUltimaAccion({ transaction }) {
    const data = await accionModel.findOne({
      attributes: ['codigo_interno'],
      where: {
        tipo_servicio: 'ALCANTARILLADO',
      },
      order: [['codigo_interno', 'DESC']],
      transaction,
      raw: true,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
}
