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
  static async getAll(page = 1, limit = 10, search = '', estado = 'ACTIVO') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const valoresPermitidos = ['ACTIVO', 'PASIVO', 'ANULADO'];

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
        sequelize.where(
          sequelize.cast(sequelize.col('acciones.codigo_interno'), 'TEXT'),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),
        {
          '$calleAccion.nombre_calle$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAccion.nombres$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAccion.primer_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAccion.segundo_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$tarifaAccion.nombre_tarifa$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await accionModel.findAndCountAll({
      attributes: {
        exclude: [
          'socio_id',
          'calle_id',
          'tarifa_id',
          'createdAt',
          'updatedAt',
        ],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col('socioAccion.nombres'),
              col('socioAccion.primer_apellido'),
              col('socioAccion.segundo_apellido'),
            ),
            'nombre_completo',
          ],
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
      },
      where,
      include: [
        { model: socioModel, as: 'socioAccion', attributes: [] },
        { model: calleRamalModel, as: 'calleAccion', attributes: [] },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: cobroAguaModel,
          as: 'cobrosAccionAgua',
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
          order: [['createdAt', 'DESC']],
        },
      ],
      limit,
      offset,
      order: [['codigo_interno', 'DESC']],
      subQuery: false,
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
    const dataId = accionModel.findByPk(id, {
      attributes: {
        exclude: [
          'socio_id',
          'calle_id',
          'tarifa_id',
          'createdAt',
          'updatedAt',
        ],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col('socioAccion.nombres'),
              col('socioAccion.primer_apellido'),
              col('socioAccion.segundo_apellido'),
            ),
            'nombre_completo',
          ],
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
      },
      include: [
        { model: socioModel, as: 'socioAccion', attributes: [] },
        { model: calleRamalModel, as: 'calleAccion', attributes: [] },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: cobroAguaModel,
          as: 'cobrosAccionAgua',
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
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!dataId) {
      throw new Error('No se encontro el socio');
    }
    return dataId;
  }
  static async historial(id) {
    const dataId = accionModel.findByPk(id, {
      attributes: {
        exclude: [
          'socio_id',
          'calle_id',
          'tarifa_id',
          'createdAt',
          'updatedAt',
        ],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col('socioAccion.nombres'),
              col('socioAccion.primer_apellido'),
              col('socioAccion.segundo_apellido'),
            ),
            'nombre_completo',
          ],
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
      },
      include: [
        { model: socioModel, as: 'socioAccion', attributes: [] },
        { model: calleRamalModel, as: 'calleAccion', attributes: [] },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: cobroAguaModel,
          as: 'cobrosAccionAgua',
          attributes: [
            'id',
            'concepto',
            'descripcion',
            'monto_total',
            'monto_pagado',
            'saldo',
            'estado',
          ],
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!dataId) {
      throw new Error('No se encontro el socio');
    }
    return dataId;
  }
  static async pagarAdmin(accion_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { monto, cobro_agua_id, metodo_pago = 'QR', observacion } = payload;

      const montoPago = Number(monto);

      if (!montoPago || montoPago <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const accionSearch = await accionModel.findByPk(accion_id, {
        transaction: t,
      });

      if (!accionSearch) {
        const err = new Error('No se encotro la accion');
        err.statusCode = 404;
        throw err;
      }
      const socioSearch = await socioModel.findByPk(accionSearch.socio_id, {
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
        numeroAccion: accionSearch.codigo_interno,
        direccion: socioSearch.direccion,
        periodo: obtenerPeriodo.mes,
        numeroMedidor: accionSearch.nro_medidor,
        lecturaAnterior: lecturaPagar.lectura_anterior,
        lecturaActual: lecturaPagar.lectura_actual,
        consumo: lecturaPagar.consumo_m3,
        montoAgua: montoPago,
        formaPago: metodo_pago,
        cajero: 'Administrador',
      });

      return pdfBytes;
    });
  }
}
