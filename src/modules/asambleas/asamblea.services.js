import { Op, col, fn } from 'sequelize';
import { accionModel } from '../../models/accion/accion.model.js';
import { asistenciaAsambleaModel } from '../../models/asamblea/asistenciaAsamblea.model.js';
import { asambleaModel } from '../../models/asamblea/asamblea.model.js';
import { socioModel } from '../../models/socio.model.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { cobroAsamblea } from '../../models/cobros/tipoCobros/cobroAsamblea.model.js';
import { ValidacionesSequelize as valids } from '../../validators/ValidacionesSequelize.js';
import { sequelize } from '../../config/database.js';

export class AsambleaServices {
  static async getAll(page = 1, limit = 10, search = '', estado = undefined) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const valoresPermitidos = [true, false];

    if (estado !== undefined && !valoresPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );

      error.status = 400;
      throw error;
    }

    const where = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        {
          titulo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          fecha_string: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          lugar: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await asambleaModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getId(id) {
    const data = await asambleaModel.findByPk(id, {
      include: [
        {
          model: asistenciaAsambleaModel,
          as: 'asistencias',
          attributes: ['id', 'asistio', 'observacion'],
          include: [
            {
              model: accionModel,
              as: 'accionAsamblea',
              attributes: ['id', 'codigo_interno'],
              include: [
                {
                  model: socioModel,
                  as: 'socioAccion',
                  attributes: [
                    'ci_socio',
                    [
                      fn(
                        'CONCAT',
                        col('nombres'),
                        ' ',
                        col('primer_apellido'),
                        ' ',
                        col('segundo_apellido'),
                      ),
                      'nombre_completo',
                    ],
                    'numero_celular',
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!data) {
      const err = new Error('No se encontro la asamblea');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async create(payload) {
    return await sequelize.transaction(async (t) => {
      const createdAsamblea = await asambleaModel.create(
        { payload },
        { transaction: t },
      );

      const ObtenerAcciones = await accionModel.findAll({
        where: {
          estado: {
            [Op.ne]: 'ANULADO',
          },
        },
        transaction: t,
      });

      for (let accion of ObtenerAcciones) {
        await asistenciaAsambleaModel.create(
          {
            asamblea_id: createdAsamblea.id,
            accion_id: accion.id,
          },
          { transaction: t },
        );
      }
      return createdAsamblea;
    });
  }
  static async update(id, payload) {
    const data = asambleaModel.findByPk(id);
    if (!data) {
      const err = new Error('No se encontro la asamblea');
      err.statusCode = 404;
      throw err;
    }
    return await data.update(id, payload);
  }
  static async updateAccion(id_asamblea, payload) {
    return await sequelize.transaction(async (t) => {
      const { id_accion, asistio, observacion } = payload;

      // =====================================================
      // VALIDAR ESTADO
      // =====================================================

      const valoresPermitidos = ['ASISTIO', 'FALTA', 'SIN EFECTO'];

      if (!valoresPermitidos.includes(asistio)) {
        const err = new Error(
          `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
        );
        err.statusCode = 400;
        throw err;
      }

      // =====================================================
      // BUSCAR ASAMBLEA
      // =====================================================

      const asamblea = await asambleaModel.findByPk(id_asamblea, {
        transaction: t,
      });

      if (!asamblea) {
        const err = new Error('No se encontró la asamblea');
        err.statusCode = 404;
        throw err;
      }

      // =====================================================
      // BUSCAR ACCIÓN
      // =====================================================

      const accion = await accionModel.findByPk(id_accion, {
        transaction: t,
      });

      if (!accion) {
        const err = new Error('No se encontró la acción');
        err.statusCode = 404;
        throw err;
      }

      // =====================================================
      // BUSCAR SOCIO
      // =====================================================

      const socio = await socioModel.findByPk(accion.socio_id, {
        transaction: t,
      });

      if (!socio) {
        const err = new Error('No se encontró el socio');
        err.statusCode = 404;
        throw err;
      }

      // =====================================================
      // BUSCAR ASISTENCIA
      // =====================================================

      const asistencia = await asistenciaAsambleaModel.findOne({
        where: {
          asamblea_id: id_asamblea,
          accion_id: id_accion,
        },
        transaction: t,
      });

      if (!asistencia) {
        const err = new Error('No se encontró la asistencia');
        err.statusCode = 404;
        throw err;
      }

      // Guardamos el estado anterior
      const estadoAnterior = asistencia.asistio;

      // =====================================================
      // ACTUALIZAR ASISTENCIA
      // =====================================================

      await asistencia.update(
        {
          asistio,
          observacion,
        },
        {
          transaction: t,
        },
      );

      // =====================================================
      // ASISTIÓ O SIN EFECTO
      // =====================================================

      if (asistio === 'ASISTIO' || asistio === 'SIN EFECTO') {
        // Buscar si tenía una multa anteriormente
        const cobroAsambleaSearch = await cobroAsamblea.findOne({
          where: {
            asistencia_asamblea_id: asistencia.id,
          },
          transaction: t,
        });

        // Si existe multa, eliminarla
        if (cobroAsambleaSearch) {
          const cobroAsistenciaSearch = await cobroModel.findByPk(
            cobroAsambleaSearch.cobro_id,
            {
              transaction: t,
            },
          );

          // Primero eliminamos relación
          await cobroAsambleaSearch.destroy({
            transaction: t,
          });

          // Después eliminamos cobro
          if (cobroAsistenciaSearch) {
            await cobroAsistenciaSearch.destroy({
              transaction: t,
            });
          }
        }

        return asistencia;
      }

      // =====================================================
      // FALTA
      // =====================================================

      if (asistio === 'FALTA') {
        // Verificar si ya existe una multa
        const cobroExistente = await cobroAsamblea.findOne({
          where: {
            asistencia_asamblea_id: asistencia.id,
          },
          transaction: t,
        });

        // Si ya existe, NO crear otra multa
        if (cobroExistente) {
          return asistencia;
        }

        const periodoActual = await valids.ObtenerPeriodoActivo();

        const cobroAsistencia = await cobroModel.create(
          {
            socio_id: socio.id,
            accion_id: accion.id,
            periodo_id: periodoActual.id,

            tipo_cobro: 'ASAMBLEA',

            concepto: `FALTA A LA ASAMBLEA DEL ${periodoActual.mes}`,

            descripcion: `${asamblea.titulo} fecha: ${asamblea.fecha}`,

            monto_total: asamblea.monto_multa,
            saldo: asamblea.monto_multa,

            estado: 'PENDIENTE',
          },
          {
            transaction: t,
          },
        );

        await cobroAsamblea.create(
          {
            asistencia_asamblea_id: asistencia.id,
            accion_id: accion.id,
            cobro_id: cobroAsistencia.id,

            monto: asamblea.monto_multa,

            concepto: `${cobroAsistencia.descripcion} multa: ${cobroAsistencia.monto_total}`,
          },
          {
            transaction: t,
          },
        );

        return asistencia;
      }
    });
  }
}
