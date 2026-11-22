import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { accionModel } from '../../../models/accion/accion.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { col, fn, Op, where as sequelizeWhere } from 'sequelize';
import { getRangoFechas } from '../../../utils/funciones.js';

export class CobroReportesRepository {
  static async getCobros({ page, limit, search, tipo_cobro, estado }) {
    const offset = (page - 1) * limit;
    const filtros = {};

    //   estado: {
    //     [Op.in]: ['PENDIENTE', 'PARCIAL'],
    //   },

    if (tipo_cobro) {
      filtros.tipo_cobro = tipo_cobro; //ACCION_AGUA,ACCION_ALCANTARILLADO,.ETC
    }

    if (estado) {
      filtros.estado = estado; //ANULADO PENDIENTE PARCIAL PAGADOS
    }
    // FILTRAR POR NOMBRE O CI
    if (search) {
      const busqueda = `%${search}%`;

      filtros[Op.or] = [
        {
          '$socioCobro.ci_socio$': {
            [Op.iLike]: busqueda,
          },
        },
        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          {
            [Op.iLike]: busqueda,
          },
        ),
      ];
    }

    const { count, rows } = await cobroModel.findAndCountAll({
      attributes: [
        'id',
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('socioCobro.ci_socio'), 'ci_socio'],
        'concepto',
        'descripcion',
        ['monto_total', 'monto_pagar'],
        'fecha_emision',
        [col('accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('accionCobro.codigo_interno'), 'codigo_interno'],
      ],

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

      where: filtros,
      limit,
      offset,
      order: [
        ['fecha_emision', 'DESC'],
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
  static async getCobrosPorFecha({
    fecha_inicio,
    fecha_final,
    estado,
    tipo_cobro,
  }) {
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });
    const data = await cobroModel.findAll({
      attributes: [
        'id',
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('socioCobro.ci_socio'), 'ci_socio'],
        'concepto',
        'descripcion',
        ['monto_total', 'monto_pagar'],
        'fecha_emision',
        [col('accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('accionCobro.codigo_interno'), 'codigo_interno'],
      ],
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
            { model: calleRamalModel, as: 'calleAccion', attributes: [] },
          ],
        },
      ],
      where: {
        fecha_emision: {
          [Op.gte]: inicio,
          [Op.lt]: fin,
        },
        ...(estado && estado !== 'TODOS' && { estado }),
        ...(tipo_cobro && tipo_cobro !== 'TODOS' && { tipo_cobro }),
      },
      order: [['fecha_emision', 'DESC']],
      raw: true,
    });
    return data;
  }
  static async getCobroPorAccion({
    page,
    limit,
    search,
    tipo_cobro,
    estado,
    accion_id,
  }) {
    const offset = (page - 1) * limit;
    const filtros = { accion_id };

    //   estado: {
    //     [Op.in]: ['PENDIENTE', 'PARCIAL'],
    //   },

    if (tipo_cobro) {
      filtros.tipo_cobro = tipo_cobro; //ACCION_AGUA,ACCION_ALCANTARILLADO,.ETC
    }

    if (estado) {
      filtros.estado = estado; //ANULADO PENDIENTE PARCIAL PAGADOS
    }
    // FILTRAR POR NOMBRE O CI
    if (search) {
      const busqueda = `%${search}%`;

      filtros[Op.or] = [
        {
          '$socioCobro.ci_socio$': {
            [Op.iLike]: busqueda,
          },
        },
        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          {
            [Op.iLike]: busqueda,
          },
        ),
      ];
    }

    const { count, rows } = await cobroModel.findAndCountAll({
      attributes: [
        'id',
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('socioCobro.ci_socio'), 'ci_socio'],
        'concepto',
        'descripcion',
        ['monto_total', 'monto_pagar'],
        'fecha_emision',
        [col('accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('accionCobro.codigo_interno'), 'codigo_interno'],
      ],

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

      where: filtros,
      limit,
      offset,
      order: [
        ['fecha_emision', 'DESC'],
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
  static async getCobrosPorFechaporAcion({
    tipo_cobro,
    fecha_inicio,
    fecha_final,
    accion_id,
    estado,
  }) {
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });
    const data = await cobroModel.findAll({
      attributes: [
        'id',
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('socioCobro.ci_socio'), 'ci_socio'],
        'concepto',
        'descripcion',
        ['monto_total', 'monto_pagar'],
        'fecha_emision',
        [col('accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('accionCobro.codigo_interno'), 'codigo_interno'],
      ],
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
            { model: calleRamalModel, as: 'calleAccion', attributes: [] },
          ],
        },
      ],
      where: {
        fecha_emision: {
          [Op.gte]: inicio,
          [Op.lt]: fin,
        },
        accion_id,
        ...(estado && estado !== 'TODOS' && { estado }),
        ...(tipo_cobro && tipo_cobro !== 'TODOS' && { tipo_cobro }),
      },
      order: [['fecha_emision', 'DESC']],
      raw: true,
    });
    return data;
  }
  static async getCobrosPorSocio({
    page,
    limit,
    search,
    tipo_cobro,
    estado,
    socio_id,
  }) {
    const offset = (page - 1) * limit;
    const filtros = { socio_id };

    //   estado: {
    //     [Op.in]: ['PENDIENTE', 'PARCIAL'],
    //   },

    if (tipo_cobro) {
      filtros.tipo_cobro = tipo_cobro; //ACCION_AGUA,ACCION_ALCANTARILLADO,.ETC
    }

    if (estado) {
      filtros.estado = estado; //ANULADO PENDIENTE PARCIAL PAGADOS
    }
    // FILTRAR POR NOMBRE O CI
    if (search) {
      const busqueda = `%${search}%`;

      filtros[Op.or] = [
        {
          '$socioCobro.ci_socio$': {
            [Op.iLike]: busqueda,
          },
        },
        sequelizeWhere(
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          {
            [Op.iLike]: busqueda,
          },
        ),
      ];
    }

    const { count, rows } = await cobroModel.findAndCountAll({
      attributes: [
        'id',
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('socioCobro.ci_socio'), 'ci_socio'],
        'concepto',
        'descripcion',
        ['monto_total', 'monto_pagar'],
        'fecha_emision',
        [col('accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('accionCobro.codigo_interno'), 'codigo_interno'],
      ],

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

      where: filtros,
      limit,
      offset,
      order: [
        ['fecha_emision', 'DESC'],
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
  static async getCobrosPorFechaPorSocio({
    tipo_cobro,
    fecha_inicio,
    fecha_final,
    socio_id,
    estado,
  }) {
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });
    const data = await cobroModel.findAll({
      attributes: [
        'id',
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('socioCobro.nombres'),
            col('socioCobro.primer_apellido'),
            col('socioCobro.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('socioCobro.ci_socio'), 'ci_socio'],
        'concepto',
        'descripcion',
        ['monto_total', 'monto_pagar'],
        'fecha_emision',
        [col('accionCobro.calleAccion.nombre_calle'), 'nombre_calle'],
        [col('accionCobro.tipo_servicio'), 'tipo_servicio'],
        [col('accionCobro.codigo_interno'), 'codigo_interno'],
      ],
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
            { model: calleRamalModel, as: 'calleAccion', attributes: [] },
          ],
        },
      ],
      where: {
        fecha_emision: {
          [Op.gte]: inicio,
          [Op.lt]: fin,
        },
        socio_id,
        ...(estado && estado !== 'TODOS' && { estado }),
        ...(tipo_cobro && tipo_cobro !== 'TODOS' && { tipo_cobro }),
      },
      order: [['fecha_emision', 'DESC']],
      raw: true,
    });
    return data;
  }
}
