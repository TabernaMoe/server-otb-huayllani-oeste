import { cobroModel } from '../../../models/cobros/cobro.model.js';
import {
  pagoDetalleModel,
  pagoModel,
} from '../../../models/cobros/pago.model.js';
import { reciboModel } from '../../../models/cobros/recibo.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { accionModel } from '../../../models/accion/accion.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { col, fn, Op, where as sequelizeWhere } from 'sequelize';
import { getRangoFechas } from '../../../utils/funciones.js';

export class ReciboReporteRepository {
  static async getRecibos({
    page = 1,
    limit = 10,
    search,
    tipo_cobro,
    estado,
  }) {
    const offset = (page - 1) * limit;

    const filtroRercibo = {};

    if (estado !== undefined && estado !== null && estado !== '') {
      filtroRercibo.estado = estado;
    }
    const filtros = {};

    // FILTRAR POR TIPO DE COBRO
    if (tipo_cobro && tipo_cobro !== 'TODOS') {
      filtros['$cobro.tipo_cobro$'] = tipo_cobro;
    }

    // FILTRAR POR NOMBRE O CI
    if (search?.trim()) {
      const busqueda = `%${search.trim()}%`;

      filtros[Op.or] = [
        {
          '$cobro.socioCobro.ci_socio$': {
            [Op.iLike]: busqueda,
          },
        },
        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('cobro.socioCobro.nombres'),
            col('cobro.socioCobro.primer_apellido'),
            col('cobro.socioCobro.segundo_apellido'),
          ),
          {
            [Op.iLike]: busqueda,
          },
        ),
      ];
    }

    const { count, rows } = await pagoDetalleModel.findAndCountAll({
      attributes: [
        ['id', 'detalle_pago_id'],
        'cobro_id',
        'pago_id',

        // MONTO PAGADO ESPECÍFICAMENTE A ESTE COBRO
        ['monto', 'monto_pagado'],

        // DATOS DEL RECIBO
        [col('pago.recibo.id'), 'recibo_id'],
        [col('pago.recibo.numero_recibo'), 'numero_recibo'],
        [col('pago.recibo.fecha_emision'), 'fecha_emision'],

        // DATOS DEL PAGO
        [col('pago.metodo_pago'), 'metodo_pago'],
        [col('pago.fecha_pago'), 'fecha_pago'],
        [col('pago.monto_pagado'), 'total_pago'],

        // DATOS DEL SOCIO
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('cobro.socioCobro.nombres'),
            col('cobro.socioCobro.primer_apellido'),
            col('cobro.socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('cobro.socioCobro.ci_socio'), 'ci_socio'],

        // DATOS DEL COBRO
        [col('cobro.concepto'), 'concepto'],
        [col('cobro.descripcion'), 'descripcion'],
        [col('cobro.tipo_cobro'), 'tipo_cobro'],
        [col('cobro.monto_total'), 'monto_pagar'],
        [col('cobro.saldo'), 'saldo_actual'],

        // DATOS DE LA ACCIÓN
        [col('cobro.accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('cobro.accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('cobro.accionCobro.codigo_interno'), 'codigo_interno'],
      ],

      include: [
        {
          model: cobroModel,
          as: 'cobro',
          attributes: [],
          required: true,

          include: [
            {
              model: socioModel,
              as: 'socioCobro',
              attributes: [],
            },
            {
              model: accionModel,
              as: 'accionCobro',
              attributes: [],

              include: [
                {
                  model: calleRamalModel,
                  as: 'calleAccion',
                  attributes: [],
                },
              ],
            },
          ],
        },
        {
          model: pagoModel,
          as: 'pago',
          attributes: [],
          required: true,

          include: [
            {
              model: reciboModel,
              as: 'recibo',
              attributes: [],
              where: filtroRercibo,
              required: true,
            },
          ],
        },
      ],

      where: filtros,

      limit,
      offset,

      order: [
        [col('pago.recibo.fecha_emision'), 'DESC'],
        ['id', 'DESC'],
      ],

      distinct: true,
      subQuery: false,
      raw: true,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page * limit < count,
        hasPreviousPage: page > 1,
      },
    };
  }
   static async getRecibosPorFecha({
    fecha_inicio,
    fecha_final,
    tipo_cobro,
    estado,
    page = 1,
    limit = 100,
  }) {
    const offset = (page - 1) * limit;
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });

    const filtros = {};

    // FILTRAR POR TIPO DE COBRO
    if (tipo_cobro && tipo_cobro !== 'TODOS') {
      filtros['$cobro.tipo_cobro$'] = tipo_cobro;
    }

    const filtrosRecibo = {
      fecha_emision: {
        [Op.gte]: inicio,
        [Op.lt]: fin,
      },
    };

    if (estado !== undefined && estado !== null && estado !== '') {
      if (estado === true || estado === 'true') {
        filtrosRecibo.estado = true;
      } else if (estado === false || estado === 'false') {
        filtrosRecibo.estado = false;
      }
    }

    const { count, rows } = await pagoDetalleModel.findAndCountAll({
      attributes: [
        ['id', 'detalle_pago_id'],
        'cobro_id',
        'pago_id',

        // MONTO PAGADO ESPECÍFICAMENTE A ESTE COBRO
        ['monto', 'monto_pagado'],

        // DATOS DEL RECIBO
        [col('pago.recibo.id'), 'recibo_id'],
        [col('pago.recibo.numero_recibo'), 'numero_recibo'],
        [col('pago.recibo.fecha_emision'), 'fecha_emision'],

        // DATOS DEL PAGO
        [col('pago.metodo_pago'), 'metodo_pago'],
        [col('pago.fecha_pago'), 'fecha_pago'],
        [col('pago.monto_pagado'), 'total_pago'],

        // DATOS DEL SOCIO
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('cobro.socioCobro.nombres'),
            col('cobro.socioCobro.primer_apellido'),
            col('cobro.socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('cobro.socioCobro.ci_socio'), 'ci_socio'],

        // DATOS DEL COBRO
        [col('cobro.concepto'), 'concepto'],
        [col('cobro.descripcion'), 'descripcion'],
        [col('cobro.tipo_cobro'), 'tipo_cobro'],
        [col('cobro.monto_total'), 'monto_pagar'],
        [col('cobro.saldo'), 'saldo_actual'],

        // DATOS DE LA ACCIÓN
        [col('cobro.accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('cobro.accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('cobro.accionCobro.codigo_interno'), 'codigo_interno'],
      ],

      include: [
        {
          model: cobroModel,
          as: 'cobro',
          attributes: [],
          required: true,

          include: [
            {
              model: socioModel,
              as: 'socioCobro',
              attributes: [],
            },
            {
              model: accionModel,
              as: 'accionCobro',
              attributes: [],

              include: [
                {
                  model: calleRamalModel,
                  as: 'calleAccion',
                  attributes: [],
                },
              ],
            },
          ],
        },
        {
          model: pagoModel,
          as: 'pago',
          attributes: [],
          required: true,

          include: [
            {
              model: reciboModel,
              as: 'recibo',
              attributes: [],
              where: filtrosRecibo,
              required: true,
            },
          ],
        },
      ],

      where: filtros,

      limit,
      offset,

      order: [[col('pago.recibo.fecha_emision'), 'DESC']],

      distinct: true,
      subQuery: false,
      raw: true,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page * limit < count,
        hasPreviousPage: page > 1,
      },
    };
  }
  static async getRecibosPorAccion({
    accion_id,
    page = 1,
    limit = 10,
    search,
    tipo_cobro,
    estado,
  }) {
        const offset = (page - 1) * limit;
    const filtroRercibo = {};

    if (estado !== undefined && estado !== null && estado !== '') {
      filtroRercibo.estado = estado;
    }

    const filtros = { '$cobro.accion_id$': accion_id };

    // FILTRAR POR TIPO DE COBRO
    if (tipo_cobro && tipo_cobro !== 'TODOS') {
      filtros['$cobro.tipo_cobro$'] = tipo_cobro;
    }

    // FILTRAR POR NOMBRE O CI
    if (search?.trim()) {
      const busqueda = `%${search.trim()}%`;

      filtros[Op.or] = [
        {
          '$cobro.socioCobro.ci_socio$': {
            [Op.iLike]: busqueda,
          },
        },
        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('cobro.socioCobro.nombres'),
            col('cobro.socioCobro.primer_apellido'),
            col('cobro.socioCobro.segundo_apellido'),
          ),
          {
            [Op.iLike]: busqueda,
          },
        ),
      ];
    }

    const { count, rows } = await pagoDetalleModel.findAndCountAll({
      attributes: [
        ['id', 'detalle_pago_id'],
        'cobro_id',
        'pago_id',

        // MONTO PAGADO ESPECÍFICAMENTE A ESTE COBRO
        ['monto', 'monto_pagado'],

        // DATOS DEL RECIBO
        [col('pago.recibo.id'), 'recibo_id'],
        [col('pago.recibo.numero_recibo'), 'numero_recibo'],
        [col('pago.recibo.fecha_emision'), 'fecha_emision'],

        // DATOS DEL PAGO
        [col('pago.metodo_pago'), 'metodo_pago'],
        [col('pago.fecha_pago'), 'fecha_pago'],
        [col('pago.monto_pagado'), 'total_pago'],

        // DATOS DEL SOCIO
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('cobro.socioCobro.nombres'),
            col('cobro.socioCobro.primer_apellido'),
            col('cobro.socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('cobro.socioCobro.ci_socio'), 'ci_socio'],

        // DATOS DEL COBRO
        [col('cobro.concepto'), 'concepto'],
        [col('cobro.descripcion'), 'descripcion'],
        [col('cobro.tipo_cobro'), 'tipo_cobro'],
        [col('cobro.monto_total'), 'monto_pagar'],
        [col('cobro.saldo'), 'saldo_actual'],

        // DATOS DE LA ACCIÓN
        [col('cobro.accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('cobro.accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('cobro.accionCobro.codigo_interno'), 'codigo_interno'],
      ],

      include: [
        {
          model: cobroModel,
          as: 'cobro',
          attributes: [],
          required: true,

          include: [
            {
              model: socioModel,
              as: 'socioCobro',
              attributes: [],
            },
            {
              model: accionModel,
              as: 'accionCobro',
              attributes: [],

              include: [
                {
                  model: calleRamalModel,
                  as: 'calleAccion',
                  attributes: [],
                },
              ],
            },
          ],
        },
        {
          model: pagoModel,
          as: 'pago',
          attributes: [],
          required: true,

          include: [
            {
              model: reciboModel,
              as: 'recibo',
              attributes: [],
              where: filtroRercibo,
              required: true,
            },
          ],
        },
      ],

      where: filtros,

      limit,
      offset,

      order: [
        [col('pago.recibo.fecha_emision'), 'DESC'],
        ['id', 'DESC'],
      ],

      distinct: true,
      subQuery: false,
      raw: true,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page * limit < count,
        hasPreviousPage: page > 1,
      },
    };
  }
   static async getRecibosPorFechaPorAccion({
    accion_id,
    fecha_inicio,
    fecha_final,
    tipo_cobro,
    estado,
    page = 1,
    limit = 100,
  }) {
    const offset = (page - 1) * limit;
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });

    const filtros = { '$cobro.accion_id$': accion_id };

    // FILTRAR POR TIPO DE COBRO
    if (tipo_cobro && tipo_cobro !== 'TODOS') {
      filtros['$cobro.tipo_cobro$'] = tipo_cobro;
    }

    const filtrosRecibo = {
      fecha_emision: {
        [Op.gte]: inicio,
        [Op.lt]: fin,
      },
    };

    if (estado !== undefined && estado !== null && estado !== '') {
      if (estado === true || estado === 'true') {
        filtrosRecibo.estado = true;
      } else if (estado === false || estado === 'false') {
        filtrosRecibo.estado = false;
      }
    }

    const { count, rows } = await pagoDetalleModel.findAndCountAll({
      attributes: [
        ['id', 'detalle_pago_id'],
        'cobro_id',
        'pago_id',

        // MONTO PAGADO ESPECÍFICAMENTE A ESTE COBRO
        ['monto', 'monto_pagado'],

        // DATOS DEL RECIBO
        [col('pago.recibo.id'), 'recibo_id'],
        [col('pago.recibo.numero_recibo'), 'numero_recibo'],
        [col('pago.recibo.fecha_emision'), 'fecha_emision'],

        // DATOS DEL PAGO
        [col('pago.metodo_pago'), 'metodo_pago'],
        [col('pago.fecha_pago'), 'fecha_pago'],
        [col('pago.monto_pagado'), 'total_pago'],

        // DATOS DEL SOCIO
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('cobro.socioCobro.nombres'),
            col('cobro.socioCobro.primer_apellido'),
            col('cobro.socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('cobro.socioCobro.ci_socio'), 'ci_socio'],

        // DATOS DEL COBRO
        [col('cobro.concepto'), 'concepto'],
        [col('cobro.descripcion'), 'descripcion'],
        [col('cobro.tipo_cobro'), 'tipo_cobro'],
        [col('cobro.monto_total'), 'monto_pagar'],
        [col('cobro.saldo'), 'saldo_actual'],

        // DATOS DE LA ACCIÓN
        [col('cobro.accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('cobro.accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('cobro.accionCobro.codigo_interno'), 'codigo_interno'],
      ],

      include: [
        {
          model: cobroModel,
          as: 'cobro',
          attributes: [],
          required: true,

          include: [
            {
              model: socioModel,
              as: 'socioCobro',
              attributes: [],
            },
            {
              model: accionModel,
              as: 'accionCobro',
              attributes: [],

              include: [
                {
                  model: calleRamalModel,
                  as: 'calleAccion',
                  attributes: [],
                },
              ],
            },
          ],
        },
        {
          model: pagoModel,
          as: 'pago',
          attributes: [],
          required: true,

          include: [
            {
              model: reciboModel,
              as: 'recibo',
              attributes: [],
              where: filtrosRecibo,
              required: true,
            },
          ],
        },
      ],

      where: filtros,

      limit,
      offset,

      order: [[col('pago.recibo.fecha_emision'), 'DESC']],

      distinct: true,
      subQuery: false,
      raw: true,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page * limit < count,
        hasPreviousPage: page > 1,
      },
    };
  }
}
