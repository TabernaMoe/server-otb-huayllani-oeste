import { col, fn, Op, Sequelize } from 'sequelize';
import { accionModel } from '../../models/accion/accion.model.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { socioModel } from '../../models/socio.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';
import { sequelize } from '../../config/database.js';

export class CobroServices {
  static async getAll(page = 1, limit = 10, search = '', estado = true) {
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

    let where = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.fn('COALESCE', Sequelize.col('nombres'), ''),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('primer_apellido'),
                    '',
                  ),
                  ' ',
                  Sequelize.fn(
                    'COALESCE',
                    Sequelize.col('segundo_apellido'),
                    '',
                  ),
                ),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
              Sequelize.where(
                Sequelize.cast(Sequelize.col('ci_socio'), 'TEXT'),
                {
                  [Op.iLike]: `%${search}%`,
                },
              ),
            ],
          },
        ],
      };
    }

    const { count, rows } = await socioModel.findAndCountAll({
      attributes: {
        exclude: ['user_id', 'createdAt', 'updatedAt'],
      },
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
    const dataId = await socioModel.findByPk(id, {
      attributes: [
        'ci_socio',
        'numero_celular',
        [
          Sequelize.fn(
            'CONCAT_WS',
            ' ',
            Sequelize.col('nombres'),
            Sequelize.col('primer_apellido'),
            Sequelize.col('segundo_apellido'),
          ),
          'nombre_completo',
        ],
        'nombres',
        'primer_apellido',
        'segundo_apellido',
      ],

      include: [
        {
          model: cobroModel,
          as: 'cobrosSocio',
          attributes: [
            'id',
            'tipo_cobro',
            'concepto',
            'descripcion',
            'monto_total',
            'monto_pagado',
            'saldo',
            'estado',
          ],

          where: {
            estado: {
              [Op.ne]: 'PAGADO',
            },
          },
        },
      ],
    });

    return dataId;
  }
  // static async pagar(payload) {
  //   const pagarDeuda = await sequelize.transaction(async (t) => {
  //     const { monto, cobros = [] } = payload;
  //   });
  //   const cobrosDB = await cobroModel.findAll({
  //     where: {
  //       id: {
  //         [Op.in]: cobroIds,
  //       },
  //       socio_id,
  //       estado: {
  //         [Op.in]: ['PENDIENTE', 'PARCIAL'],
  //       },
  //     },
  //     transaction: t,
  //     lock: t.LOCK.UPDATE,
  //   });

  //   if (cobrosDB.length !== cobroIds.length) {
  //     throw new Error(
  //       'Algunos cobros no existen, no pertenecen al socio o ya están pagados',
  //     );
  //   }

  //   const totalPendiente = cobrosDB.reduce((total, cobro) => {
  //     return total + Number(cobro.saldo || 0);
  //   }, 0);

  //   if (Number(monto) < totalPendiente) {
  //     throw new Error(
  //       `El monto enviado es insuficiente. Total requerido: ${totalPendiente}`,
  //     );
  //   }
  //   if (Number(monto) > totalPendiente) {
  //     throw new Error(
  //       `El monto enviado es mayo. Total requerido: ${totalPendiente}`,
  //     );
  //   }

  // }
}
