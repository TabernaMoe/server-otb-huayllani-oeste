import { Op, col, fn, Sequelize } from 'sequelize';
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
      attributes: { exclude: ['createdAt', 'updatedAt', 'periodo_id'] },
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
  static async getAcciones(asamblea_id) {
    const asambleaSearch = await asambleaModel.findByPk(asamblea_id);
    if (!asambleaSearch) {
      const err = new Error('No se encontro la asamblea');
      err.statusCode = 404;
      throw err;
    }

    const acciones = await asistenciaAsambleaModel.findAll({
      attributes: {
        include: [
          [col('accionAsamblea.codigo_interno'), 'codigo_interno'],
          [col('accionAsamblea.socioAccion.ci_socio'), 'ci_socio'],
          [
            Sequelize.fn(
              'CONCAT',
              col('accionAsamblea.socioAccion.nombres'),
              ' ',
              col('accionAsamblea.socioAccion.primer_apellido'),
              ' ',
              col('accionAsamblea.socioAccion.segundo_apellido'),
            ),
            'nombre_completo',
          ],
          [col('accionAsamblea.socioAccion.numero_celular'), 'numero_celular'],
        ],
        exclude: ['createdAt', 'updatedAt', 'accion_id', 'asamblea_id'],
      },
      include: [
        {
          model: accionModel,
          as: 'accionAsamblea',
          attributes: [],
          include: [{ model: socioModel, as: 'socioAccion' }],
        },
      ],
    });

    return acciones;
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
      const createdAsamblea = await asambleaModel.create(payload, {
        transaction: t,
      });

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
      return createdAsamblea.toJSON();
    });
  }
  static async update(id, payload) {
    const data = await asambleaModel.findByPk(id);
    if (!data) {
      const err = new Error('No se encontro la asamblea');
      err.statusCode = 404;
      throw err;
    }
    await data.update(payload);
    return data;
  }
  static async updateAccion(asistente_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { asistio, observacion } = payload;

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
      // BUSCAR ASISTENCIA
      // =====================================================

      const asistencia = await asistenciaAsambleaModel.findOne({
        where: {
          id: asistente_id,
        },
        transaction: t,
      });

      if (!asistencia) {
        const err = new Error('No se encontró la asistencia');
        err.statusCode = 404;
        throw err;
      }

      await asistencia.update(
        {
          asistio,
          observacion,
        },
        {
          transaction: t,
        },
      );

      const asamblea = await asambleaModel.findByPk(asistencia.asamblea_id, {
        transaction: t,
      });
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

        const accionSearch = await accionModel.findByPk(asistencia.accion_id);

        const cobroAsistencia = await cobroModel.create(
          {
            socio_id: accionSearch.socio_id,
            accion_id: accionSearch.id,
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
            accion_id: accionSearch.id,
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
