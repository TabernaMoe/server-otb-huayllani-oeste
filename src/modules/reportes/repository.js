import { cobroModel } from '../../models/cobros/cobro.model.js';
import { socioModel } from '../../models/socio.model.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';
import { col, fn, Op } from 'sequelize';
import { getRangoFechas } from '../../utils/funciones.js';
import { cobroAsamblea } from '../../models/cobros/tipoCobros/cobroAsamblea.model.js';
import { asambleaModel } from '../../models/asamblea/asamblea.model.js';
import { asistenciaAsambleaModel } from '../../models/asamblea/asistenciaAsamblea.model.js';
import { cobroMultaModel } from '../../models/cobros/tipoCobros/cobroMulta.model.js';

export class ReportesRepository {
  static async getCobrosAnulados() {
    const data = await cobroModel.findAll({
      attributes: [
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
        },
        {
          model: accionModel,
          as: 'accionCobro',
          include: [{ model: calleRamalModel, as: 'calleAccion' }],
        },
      ],
      where: {
        estado: 'ANULADO',
      },
    });
    return data;
  }
  static async getCobrosAnuladosPorFechas({ fecha_inicio, fecha_final }) {
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });
    const data = await cobroModel.findAll({
      attributes: [
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
        'fecha_emision',
      ],
      include: [
        {
          model: socioModel,
          as: 'socioCobro',
        },
        {
          model: accionModel,
          as: 'accionCobro',
          include: [{ model: calleRamalModel, as: 'calleAccion' }],
        },
      ],
      where: {
        estado: 'ANULADO',
        fecha_emision: {
          [Op.gte]: inicio,
          [Op.lt]: fin,
        },
      },
    });
    return data;
  }
  static async getFaltaAsamblea() {
    const data = await cobroModel.findAll({
      attributes: [
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
        [col('cobroCobroAsamblea.asistio'), 'asistio'],
        [col('cobroCobroAsamblea.asistio.asistencias'), 'titulo_asamblea'],
        [col('cobroCobroAsamblea.asistio.asistencias'), 'titulo_asamblea'],
        'fecha_emision',
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
        {
          model: cobroAsamblea,
          as: 'cobroCobroAsamblea',
          attributes: [],
          include: [
            {
              model: asistenciaAsambleaModel,
              as: 'asambleaCobro',
              attributes: [],
              include: [
                {
                  model: asambleaModel,
                  as: 'asistencias',
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
      where: {
        tipo_cobro: 'ASAMBLEA',
        estado: {
          [Op.in]: ['PENDIENTE', 'PARCIAL'],
        },
      },
    });
    return data;
  }
  static async getFaltaAsambleaPorFechas({ fecha_inicio, fecha_final }) {
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });
    const data = await cobroModel.findAll({
      attributes: [
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
        [col('cobroCobroAsamblea.asistio'), 'asistio'],
        [col('cobroCobroAsamblea.asistio.asistencias'), 'titulo_asamblea'],
        [col('cobroCobroAsamblea.asistio.asistencias'), 'titulo_asamblea'],
        'fecha_emision',
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
        {
          model: cobroAsamblea,
          as: 'cobroCobroAsamblea',
          attributes: [],
          include: [
            {
              model: asistenciaAsambleaModel,
              as: 'asambleaCobro',
              attributes: [],
              include: [
                {
                  model: asambleaModel,
                  as: 'asistencias',
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
      where: {
        tipo_cobro: 'ASAMBLEA',
        estado: {
          [Op.in]: ['PENDIENTE', 'PARCIAL'],
        },
        fecha_emision: {
          [Op.gte]: inicio,
          [Op.lt]: fin,
        },
      },
    });
    return data;
  }
  static async getMultas() {
    const data = await cobroModel.findAll({
      attributes: [
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
        },
        {
          model: accionModel,
          as: 'accionCobro',
          include: [{ model: calleRamalModel, as: 'calleAccion' }],
        },
      ],
      where: {
        estado: 'MULTA',
      },
    });
    return data;
  }

  static async getMultasForFechas({ fecha_inicio, fecha_final }) {
    const { inicio, fin } = getRangoFechas({
      fechaInicio: fecha_inicio,
      fechaFin: fecha_final,
    });
    const data = await cobroModel.findAll({
      attributes: [
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
        },
        {
          model: accionModel,
          as: 'accionCobro',
          include: [{ model: calleRamalModel, as: 'calleAccion' }],
        },
      ],
      where: {
        estado: 'MULTA',
        estado: {
          [Op.in]: ['PENDIENTE', 'PARCIAL'],
        },
        fecha_emision: {
          [Op.gte]: inicio,
          [Op.lt]: fin,
        },
      },
    });
    return data;
  }
}
