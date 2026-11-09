import { reciboModel } from '../../../models/cobros/recibo.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { accionModel } from '../../../models/accion/accion.model.js';
import { pagoModel } from '../../../models/cobros/pago.model.js';
import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { fechaBonita } from '../../../utils/funciones.js';
import { fn, col } from 'sequelize';

export class ReciboRepository {
  static async create({ payload, transaction }) {
    const ultimoRecibo = await reciboModel.findOne({
      raw: true,
      transaction,
      order: [['id', 'DESC']],
    });
    const { numero_recibo } = ultimoRecibo;
    const data = await reciboModel.create(
      { ...payload, numero_recibo: numero_recibo ? numero_recibo + 1 : 1 },
      { transaction },
    );
    return data;
  }
  static async getAll() {
    const data = await reciboModel.findAll({
      attributes: [
        'id',
        'numero_recibo',
        [
          fn(
            'concat_ws',
            ' ',
            col('socioRecibo.nombres'),
            col('socioRecibo.primer_apellido'),
            col('socioRecibo.segundo_apellido'),
          ),
          'socio',
        ],
        [col('reciboAccion.codigo_interno'), 'codigo_interno'],
        [col('pago.monto_pagado'), 'monto_pagado'],
        [col('pago.metodo_pago'), 'metodo_pago'],
        'estado',
        'fecha_emision',
      ],
      include: [
        {
          model: socioModel,
          as: 'socioRecibo',
          attributes: [],
        },
        {
          model: accionModel,
          as: 'reciboAccion',
          attributes: [],
        },
        {
          model: pagoModel,
          as: 'pago',
          include: [
            {
              model: cobroModel,
              as: 'cobrosRecibo',
              through: { attributes: [] },
              attributes: ['descripcion', 'monto_total'],
            },
          ],
        },
      ],
    });

    const dataNorn = data.map((row) => ({
      ...row.toJSON(),
      fecha_emision: fechaBonita(row.fecha_emision),
      cobros_pagados: row?.pago?.cobrosRecibo.map((row) => ({
        descripcion: row.descripcion,
        monto_pagado: row.monto_total,
      })),
      pago: undefined,
    }));
    return dataNorn;
  }
  static async getAllByAccion({ accion_id }) {
    const data = await reciboModel.findAll({
      attributes: [
        'id',
        'numero_recibo',
        [
          fn(
            'concat_ws',
            ' ',
            col('socioRecibo.nombres'),
            col('socioRecibo.primer_apellido'),
            col('socioRecibo.segundo_apellido'),
          ),
          'socio',
        ],
        [col('reciboAccion.codigo_interno'), 'codigo_interno'],
        [col('pago.monto_pagado'), 'monto_pagado'],
        [col('pago.metodo_pago'), 'metodo_pago'],
        'estado',
        'fecha_emision',
      ],
      where: {
        accion_id,
      },
      include: [
        {
          model: socioModel,
          as: 'socioRecibo',
          attributes: [],
        },
        {
          model: accionModel,
          as: 'reciboAccion',
          attributes: [],
        },
        {
          model: pagoModel,
          as: 'pago',
          include: [
            {
              model: cobroModel,
              as: 'cobrosRecibo',
              through: { attributes: [] },
              attributes: ['descripcion', 'monto_total'],
            },
          ],
        },
      ],
    });

    const dataNorn = data.map((row) => ({
      ...row.toJSON(),
      fecha_emision: fechaBonita(row.fecha_emision),
      cobros_pagados: row?.pago?.cobrosRecibo.map((row) => ({
        descripcion: row.descripcion,
        monto_pagado: row.monto_total,
      })),
      pago: undefined,
    }));
    return dataNorn;
  }
  static async getAllBySocio({ socio_id }) {
    const data = await reciboModel.findAll({
      attributes: [
        'id',
        'numero_recibo',
        [
          fn(
            'concat_ws',
            ' ',
            col('socioRecibo.nombres'),
            col('socioRecibo.primer_apellido'),
            col('socioRecibo.segundo_apellido'),
          ),
          'socio',
        ],
        [col('reciboAccion.codigo_interno'), 'codigo_interno'],
        [col('pago.monto_pagado'), 'monto_pagado'],
        [col('pago.metodo_pago'), 'metodo_pago'],
        'estado',
        'fecha_emision',
      ],
      where: {
        socio_id,
      },
      include: [
        {
          model: socioModel,
          as: 'socioRecibo',
          attributes: [],
        },
        {
          model: accionModel,
          as: 'reciboAccion',
          attributes: [],
        },
        {
          model: pagoModel,
          as: 'pago',
          include: [
            {
              model: cobroModel,
              as: 'cobrosRecibo',
              through: { attributes: [] },
              attributes: ['descripcion', 'monto_total'],
            },
          ],
        },
      ],
    });

    const dataNorn = data.map((row) => ({
      ...row.toJSON(),
      fecha_emision: fechaBonita(row.fecha_emision),
      cobros_pagados: row?.pago?.cobrosRecibo.map((row) => ({
        descripcion: row.descripcion,
        monto_pagado: row.monto_total,
      })),
      pago: undefined,
    }));
    return dataNorn;
  }
}
