import crypto from 'node:crypto';
import { col, fn, Op, Sequelize } from 'sequelize';
import { accionModel } from '../../models/accion/accion.model.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { pagoDetalleModel, pagoModel } from '../../models/cobros/pago.model.js';
import { reciboModel } from '../../models/cobros/recibo.model.js';
import { socioModel } from '../../models/socio.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';
import { sequelize } from '../../config/database.js';
import { BancoEconomicoQr } from '../../integrations/bancoEconomico/bancoEconomico.qr.js';
import { PagoQrRepository } from '../pagoQr/pagoQr.repository.js';
import { PagoQrDetalleModel } from '../../modules/pagoQr/pagoQr.model.js';
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

    if (!dataId) {
      throw new Error('No se encontro el socio');
    }

    return dataId;
  }
  static async pagarAdmin(payload) {
    return await sequelize.transaction(async (t) => {
      const { socio_id, monto, cobros = [], metodo_pago } = payload;

      const montoPago = Number(monto);

      if (!socio_id) {
        throw new Error('Debe enviar el socio');
      }

      if (!Array.isArray(cobros) || cobros.length === 0) {
        throw new Error('Debe seleccionar al menos un cobro');
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

      const cobroIds = cobros.map((item) =>
        typeof item === 'object' ? item.cobro_id : item,
      );

      const cobrosDB = await cobroModel.findAll({
        where: {
          id: { [Op.in]: cobroIds },
          socio_id,
          estado: { [Op.in]: ['PENDIENTE', 'PARCIAL'] },
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (cobrosDB.length !== cobroIds.length) {
        throw new Error(
          'Algunos cobros no existen, no pertenecen al socio o ya están pagados',
        );
      }

      const totalPendiente = cobrosDB.reduce((total, cobro) => {
        return total + Number(cobro.saldo || 0);
      }, 0);

      if (cobrosDB.length === 1) {
        if (montoPago > totalPendiente) {
          throw new Error(
            `El monto no puede ser mayor al saldo del cobro. Saldo actual: ${totalPendiente}`,
          );
        } else {
          if (montoPago !== totalPendiente && montoPago < 100) {
            throw new Error(
              `El monto minimo para pagar a plazos es 100bs. Saldo acual: ${totalPendiente}`,
            );
          }
        }
      } else {
        if (montoPago !== totalPendiente) {
          throw new Error(
            `Para pagar varios cobros debe pagar el total exacto: ${totalPendiente}`,
          );
        }
      }
      if (metodo_pago === 'EFECTIVO') {
        const pagoCreated = await pagoModel.create(
          {
            monto_pagado: montoPago,
            metodo_pago,
            fecha_pago: new Date(),
          },
          { transaction: t },
        );

        const detalles = [];

        for (const cobro of cobrosDB) {
          const saldoActual = Number(cobro.saldo || 0);

          let montoAplicado = saldoActual;

          if (cobrosDB.length === 1) {
            montoAplicado = montoPago;
          }

          const nuevoMontoPagado =
            Number(cobro.monto_pagado || 0) + montoAplicado;

          const nuevoSaldo = saldoActual - montoAplicado;

          const nuevoEstado = nuevoSaldo === 0 ? 'PAGADO' : 'PARCIAL';

          await cobro.update(
            {
              monto_pagado: nuevoMontoPagado,
              saldo: nuevoSaldo,
              estado: nuevoEstado,
            },
            { transaction: t },
          );

          const detalle = await pagoDetalleModel.create(
            {
              cobro_id: cobro.id,
              pago_id: pagoCreated.id,
              monto: montoAplicado,
            },
            { transaction: t },
          );

          detalles.push(detalle);
        }
        //
        const reciboCreated = await reciboModel.create(
          {
            pago_id: pagoCreated.id,
            // numero_recibo: numeroRecibo,
            fecha_emision: new Date(),
          },
          { transaction: t },
        );

        return {
          pago: pagoCreated,
          recibo: reciboCreated,
          detalle: detalles,
        };
      } else {
        const transactionId = `QR-${crypto.randomUUID()}`;
        const bancoResponse = await BancoEconomicoQr.generateQR({
          transactionId,
          currency: 'BOB',
          amount: montoPago,
          description: 'Prueba pagos',
          dueDate: '2026-08-25',
          singleUse: true,
          modifyAmount: false,
        });

        try {
          const pagoQr = await PagoQrRepository.create({
            transaction_id: transactionId,

            qr_id: bancoResponse.qrId,

            qr_image: bancoResponse.qrImage,

            monto: montoPago,

            moneda: 'BOB',

            descripcion: 'description' || null,

            fecha_vencimiento: '2026-08-25',

            single_use: true,

            modify_amount: false,

            estado: 'PENDIENTE',
          });

          for (const cobro of cobrosDB) {
            const saldoActual = Number(cobro.saldo || 0);

            let montoAplicado = saldoActual;

            if (cobrosDB.length === 1) {
              montoAplicado = montoPago;
            }

            const nuevoMontoPagado =
              Number(cobro.monto_pagado || 0) + montoAplicado;

            const nuevoSaldo = saldoActual - montoAplicado;

            const nuevoEstado = nuevoSaldo === 0 ? 'PAGADO' : 'PARCIAL';

            await cobro.update(
              {
                monto_pagado: nuevoMontoPagado,
                saldo: nuevoSaldo,
                estado: nuevoEstado,
              },
              { transaction: t },
            );

            await PagoQrDetalleModel.create(
              {
                cobro_id: cobro.id,
                pago_qr_id: pagoQr.id,
                monto: montoAplicado,
              },
              { transaction: t },
            );
          }

          return {
            id: pagoQr.id,
            transactionId: pagoQr.transaction_id,
            qrId: pagoQr.qr_id,
            qrImage: pagoQr.qr_image,
            amount: pagoQr.monto,
            currency: pagoQr.moneda,
            description: pagoQr.descripcion,
            dueDate: pagoQr.fecha_vencimiento,
            estado: pagoQr.estado,
          };
        } catch (dbError) {
          await this.cancelarQrCompensatorio({
            qrId: bancoResponse.qrId,

            transactionId,

            dbError,
          });

          throw dbError;
        }
      }
    });
  }
  static async cancelarQrCompensatorio({ qrId, transactionId, dbError }) {
    try {
      await BancoEconomicoQr.cancelQR(qrId);

      console.error(`[QR COMPENSADO] QR anulado: ${qrId}`);
    } catch (cancelError) {
      console.error('[QR COMPENSACIÓN FALLIDA]', {
        qrId,
        transactionId,

        databaseError: dbError.message,

        cancelError: cancelError.message,
      });

      const error = new Error('No se pudo registrar ni anular el QR generado');

      error.statusCode = 500;

      throw error;
    }
  }
  static async verificarPago(id) {
    const pago = await PagoQrRepository.findById(id);

    if (!pago) {
      const error = new Error('Pago QR no encontrado');

      error.statusCode = 404;

      throw error;
    }

    const bancoResponse = await BancoEconomicoQr.statusQR(pago.qr_id);

    const statusQrCode = Number(bancoResponse.statusQrCode);

    let estado;

    switch (statusQrCode) {
      case 0:
        estado = 'PENDIENTE';
        break;

      case 1:
        estado = 'PAGADO';
        break;

      case 9:
        estado = 'ANULADO';
        break;

      default: {
        const error = new Error(`Estado QR desconocido: ${statusQrCode}`);

        error.statusCode = 502;

        throw error;
      }
    }
  }
}
