import { sequelize } from '../../config/database.js';
import { col, fn, Op, Sequelize } from 'sequelize';
import { generarReciboAguaPDF } from '../../helpers/generarReciboAguaPDF.js';
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
//
import { ValidacionesSequelize as validaciones } from '../../validators/ValidacionesSequelize.js';
import { lecturaAguaModel } from '../../models/lecturasAgua/lecturasAgua.model.js';

export class CobroAguaServices {
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
      ],

      include: [
        {
          model: cobroAguaModel,
          as: 'cobrosAgua',
          attributes: [
            'id',
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
          required: false,
        },
      ],
    });

    if (!dataId) {
      throw new Error('No se encontro el socio');
    }
    return dataId;
  }
  static async historial(id) {
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
      ],

      include: [
        {
          model: cobroAguaModel,
          as: 'cobrosAgua',
          attributes: [
            'id',
            'concepto',
            'descripcion',
            'monto_total',
            'monto_pagado',
            'saldo',
            'estado',
          ],
        },
      ],
    });

    if (!dataId) {
      throw new Error('No se encontro el socio');
    }
    return dataId;
  }
  static async pagarAdmin(socio_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { monto, cobro_agua_id, metodo_pago = 'QR', observacion } = payload;

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
      if (!cobroSearch) {
        const err = new Error('No se encontro cobro');
        err.statuscode = 404;
        throw err;
      }

      // const montoPagoValidado = cobroSearch?.monto_total - montoPago;
      // console.log('***********************+');
      // console.log(montoPagoValidado);
      // console.log('***********************+');

      if (!montoPago != cobroSearch.monto_total && montoPago < 100) {
        throw new Error(
          'Los pagos menores a 100 solo tienen la opcion de pago unico',
        );
      }

      const obtenerPeriodo = await validaciones.ObtenerPeriodoActivo({
        transaction: t,
      });

      const obtenerPeriAnt = await periodoModel.findByPk(
        obtenerPeriodo.id - 1,
        {
          transaction: t,
        },
      );

      if (obtenerPeriAnt && obtenerPeriAnt.mes != 'ENERO') {
        const cobroAntSearch = await cobroAguaModel.findOne(
          {
            where: { periodo_id: obtenerPeriAnt.id },
          },
          {
            transaction: t,
          },
        );

        if (cobroAntSearch && !cobroAntSearch.estado != 'PAGADO') {
          const err = new Error('Debes pagar el mes anterior primero');
          err.status = 400;
          throw err;
        }
      }

      const lecturaPagar = await lecturaAguaModel.findByPk(
        cobroSearch.lectura_id,
        {
          transaction: t,
        },
      );

      const nuevoMontoPagado =
        Number(cobroSearch.monto_pagado || 0) + montoPago;

      const nuevoSaldo = Number(cobroSearch.saldo || 0) - montoPago;

      const nuevoEstado = nuevoSaldo === 0 ? 'PAGADO' : 'PARCIAL';
      if (nuevoSaldo < 0) {
        throw new Error(
          `El monto no puede ser mayor al saldo del cobro. Saldo actual: ${cobroSearch.saldo}`,
        );
      }

      await cobroSearch.update(
        {
          monto_pagado: nuevoMontoPagado,
          saldo: nuevoSaldo,
          estado: nuevoEstado,
        },
        {
          transaction: t,
        },
      );
      const pagarCreated = await pagoAguaModel.create(
        {
          cobro_agua_id: cobroSearch.id,
          monto: montoPago,
          metodo_pago: metodo_pago,
          observacion,
        },
        {
          transaction: t,
        },
      );
      const reciboCreated = await reciboAguaModel.create(
        {
          pago_agua_id: pagarCreated.id,
        },
        {
          transaction: t,
        },
      );
      const pdfBytes = await generarReciboAguaPDF({
        numeroRecibo: reciboCreated.numero_recibo,
        fechaPago: reciboCreated.fecha_emision,
        nombreSocio: `${socioSearch.nombres} ${socioSearch.primer_apellido} ${socioSearch.segundo_apellido}`,
        numeroAccion: '00125',
        direccion: socioSearch.direccion,
        periodo: obtenerPeriodo.mes,
        numeroMedidor: socioSearch.direccion,
        lecturaAnterior: lecturaPagar.lectura_anterior,
        lecturaActual: lecturaPagar.lectura_actual,
        consumo: lecturaPagar.consumo_m3,
        montoAgua: lecturaPagar.precio,
        formaPago: metodo_pago,
        cajero: 'Administrador',
      });

      return pdfBytes;
    });
  }
}
