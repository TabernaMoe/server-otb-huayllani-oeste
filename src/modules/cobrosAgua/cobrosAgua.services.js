import { sequelize } from '../../config/database.js';
import { col, fn, Op, Sequelize } from 'sequelize';
//
import { cobroAguaModel } from '../../models/cobroAgua/cobroAgua.model.js';
import { pagoAguaModel } from '../../models/cobroAgua/pagoAgua.model.js';
import { reciboAguaModel } from '../../models/cobroAgua/recibo.mode.js';
//
import { periodoModel } from '../../models/gestiones/periodo.model.js';
//
import { socioModel } from '../../models/socio.model.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';

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
        exclude: [
          'user_id',
          'createdAt',
          'updatedAt',
          'estado',
          'genero',
          'numero_telefono',
        ],
      },
      include: [
        {
          model: accionModel,
          as: 'acciones',
          attributes: ['codigo_interno', 'nro_medidor', 'estado'],
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      distinct: true,
    });

    const rowNor = rows.map((row) => {
      const newRow = row.toJSON ? row.toJSON() : { ...row };

      newRow.nombre_completo =
        `${newRow.nombres} ${newRow.primer_apellido} ${newRow.segundo_apellido}`.trim();
      newRow.ci = `${newRow.ci_socio} ${newRow.ci_expedido}`.trim();

      delete newRow.nombres;
      delete newRow.primer_apellido;
      delete newRow.segundo_apellido;
      delete newRow.ci_socio;
      delete newRow.ci_expedido;

      return newRow;
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rowNor,
    };
  }
  static async getId(socio_id) {
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
          model: cobroAguaModel,
          as: 'cobrosAgua',
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
    if (dataId) {
      throw new Error('No se encontro la accion');
    }
  }
  static async pagarAdmin(socio_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { monto, cobro_agua_id, metodo_pago = 'QR' } = payload;

      const montoPago = Number(monto);

      if (!socio_id) {
        throw new Error('Debe enviar el socio');
      }
      if (!montoPago || montoPago <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const socioSearch = await socioModel.findByPk(socio_id, {
        transaction: t,
      });
      if (!socioSearch) {
        const err = new Error('No se encotro al socio');
        err.statusCode = 404;
        throw err;
      }

      const cobroSearch = await cobroAguaModel.findByPk(cobro_agua_id, {
        transaction: t,
      });
      if (cobroSearch) {
        const err = new Error('No se encontro cobro');
        err.statuscode = 404;
        throw err;
      }

      const montoPagoValidado = cobroSearch?.monto_total - montoPago;
      if (montoPagoValidado <= 100) {
        throw new Error(
          'Los pagos menores a 100 solo tienen la opcion de pago unico',
        );
      }
      
    });
  }
}
