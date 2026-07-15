import { Op, col, fn } from 'sequelize';
import { accionModel } from '../../../models/accion/accion.model.js';
import { asistenciaAsambleaModel } from '../../../models/asamblea/asistenciaAsamblea.model.js';
import { asambleaModel } from '../../../models/asamblea/asamblea.model.js';
import { multaModel } from '../../../models/asamblea/multa.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { cobroAsamblea } from '../../../models/cobros/tipoCobros/cobroAsamblea.model.js';
import { ValidacionesSequelize as valids } from '../../../validators/ValidacionesSequelize.js';
import { sequelize } from '../../../config/database.js';

export class AsambleaClass {
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
      const [multaSearch] = await multaModel.findAll();

      const createdAsamblea = await asambleaModel.create(
        { ...payload, multa_id: multaSearch.id },
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
  static async updateAccion(id_asamblea, { payload }) {
    return await sequelize.transaction(async (t) => {
      const { id_accion, asistio } = payload;
      const asambleaId = await asambleaModel.findByPk(id_asamblea, {
        transaction: t,
        raw: true,
      });
      if (!asambleaId) {
        const err = new Error('No se encontro la asamblea');
        err.statusCode = 404;
        throw err;
      }
      const accionId = await accionModel.findByPk(id, {
        transaction: t,
        raw: true,
      });
      if (!accionId) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      const socioId = await socioModel.findByPk(accionId.socio_id, {
        transaction: t,
        raw: true,
      });
      const valoresPermitidos = ['ASISTIO', 'FALTA', 'SIN EFECTO'];
      if (!valoresPermitidos.includes(asistio)) {
        throw new Error(
          `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
        );
      }
      const asistenciaSearch = await asistenciaAsambleaModel.findOne({
        where: {
          asamblea_id: id_asamblea,
          accion_id: id_accion,
        },
        transaction: t,
      });
      if (!asistenciaSearch) {
        const err = new Error('No se encontro la asistencia');
        err.statusCode = 404;
        throw err;
      }

      if (asistio == 'ASISTIO' || asistio == 'SIN EFECTO') {
        await asistenciaSearch.update(payload, { transaction: t });
        return asistenciaSearch;
      } else {
        if ((asistio = 'FALTA')) {
          const periodoAcutal = await valids.ObtenerPeriodoActivo();
          await asistenciaSearch.update(payload, { transaction: t });
          const [multaSearch] = await multaModel.findAll();
          const cobroAsistencia = await cobroModel.create(
            {
              socio_id: socioId.id,
              periodo_id: periodoAcutal.id,
              tipo_cobro: 'ASAMBLEA',
              concepto: 'Falta a la asamblea',
              descripcion: 'Falta a la asamblea',
              monto_total: multaSearch.monto_multa,
              saldo: multaSearch.monto_multa,
              estado: 'PENDIENTE',
            },
            {
              transaction: t,
            },
          );
          await cobroAsamblea.create(
            {
              asistencia_asamblea_id: asistenciaSearch.id,
              accion_id: accionId.id,
              cobro_id: cobroAsistencia.id,
              fecha_asamblea: asambleaId.fecha,
              precio: multaSearch.monto_multa,
            },
            {
              transaction: t,
            },
          );
          return asistenciaSearch;
        }
      }
    });
  }
}
