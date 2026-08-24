import crypto from 'node:crypto';

import { BancoEconomicoQr } from '../../integrations/bancoEconomico/bancoEconomico.qr.js';

import { PagoQrRepository } from './pagoQr.repository.js';

export class PagoQrService {
  static async listar({ page = 1, limit = 10, estado }) {
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);

    const currentLimit = Math.min(
      100,
      Math.max(1, Number.parseInt(limit, 10) || 10),
    );

    const result = await PagoQrRepository.findAll({
      page: currentPage,
      limit: currentLimit,
      estado,
    });

    return {
      data: result.rows,

      pagination: {
        page: currentPage,

        limit: currentLimit,

        total: result.count,

        totalPages: Math.ceil(result.count / currentLimit),
      },
    };
  }
  static async generarQr({
    amount,
    description,
    dueDate,
    currency = 'BOB',
    branchCode,
  }) {
    const transactionId = `QR-${crypto.randomUUID()}`;

    const bancoResponse = await BancoEconomicoQr.generateQR({
      transactionId,
      currency,
      amount,
      description,
      dueDate,
      singleUse: true,
      modifyAmount: false,
      branchCode,
    });

    try {
      const pagoQr = await PagoQrRepository.create({
        transaction_id: transactionId,

        qr_id: bancoResponse.qrId,

        qr_image: bancoResponse.qrImage,

        monto: amount,

        moneda: currency,

        descripcion: description || null,

        fecha_vencimiento: dueDate,

        single_use: true,

        modify_amount: false,

        estado: 'PENDIENTE',
      });

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
  static async verificarEstado(id) {
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

    /*
     * Si está PAGADO, Banco devuelve
     * la información del PaymentQR.
     */
    if (estado === 'PAGADO') {
      const payment = bancoResponse.payment?.[0];

      if (!payment) {
        const error = new Error(
          'Banco reportó el QR como pagado pero no devolvió información del pago',
        );

        error.statusCode = 502;

        throw error;
      }

      /*
       * Validamos moneda.
       */
      if (payment.currency !== pago.moneda) {
        const error = new Error('La moneda pagada no coincide con el QR');

        error.statusCode = 409;

        throw error;
      }

      /*
       * Validamos importe utilizando centavos
       * para evitar problemas de decimales JS.
       */
      const montoEsperado = Math.round(Number(pago.monto) * 100);

      const montoPagado = Math.round(Number(payment.amount) * 100);

      if (!pago.modify_amount && montoEsperado !== montoPagado) {
        const error = new Error(
          'El monto pagado no coincide con el monto del QR',
        );

        error.statusCode = 409;

        throw error;
      }

      await PagoQrRepository.updateById(pago.id, {
        estado: 'PAGADO',

        fecha_pago: payment.paymentDate?.substring(0, 10) || null,

        hora_pago: payment.paymentTime || null,

        monto_pagado: payment.amount,

        banco_origen: payment.senderBankCode || null,

        nombre_pagador: payment.senderName || null,

        cuenta_pagador: payment.senderAccount || null,
      });
    } else if (pago.estado !== estado) {
      await PagoQrRepository.updateById(pago.id, {
        estado,
      });
    }

    return {
      id: pago.id,

      qrId: pago.qr_id,

      transactionId: pago.transaction_id,

      estado,

      statusQrCode,

      payment: bancoResponse.payment ?? [],
    };
  }
  static async obtenerPorId(id) {
    const pago = await PagoQrRepository.findById(id);

    if (!pago) {
      const error = new Error('Pago QR no encontrado');

      error.statusCode = 404;

      throw error;
    }

    return {
      id: pago.id,

      transactionId: pago.transaction_id,

      qrId: pago.qr_id,

      qrImage: pago.qr_image,

      amount: pago.monto,

      currency: pago.moneda,

      description: pago.descripcion,

      dueDate: pago.fecha_vencimiento,

      estado: pago.estado,

      fechaPago: pago.fecha_pago,

      montoPagado: pago.monto_pagado,
    };
  }
  static async conciliarPagos(fecha) {
    if (!/^\d{8}$/.test(fecha)) {
      const error = new Error('La fecha debe tener formato yyyyMMdd');

      error.statusCode = 400;

      throw error;
    }

    /*
     * 1. Obtener todos los pagos que
     * Banco Económico reporta en esa fecha.
     */
    const bancoResponse = await BancoEconomicoQr.paidQR(fecha);

    const paymentList = bancoResponse.paymentList;

    const resultado = {
      fecha,

      totalBanco: paymentList.length,

      actualizados: 0,

      yaPagados: 0,

      noEncontrados: 0,

      inconsistencias: 0,

      detalles: [],
    };

    /*
     * 2. Conciliar uno por uno.
     *
     * Importante:
     * un problema con un pago no debe
     * detener toda la conciliación.
     */
    for (const payment of paymentList) {
      try {
        const pago = await PagoQrRepository.findByQrId(payment.qrId);

        /*
         * Banco tiene el pago pero nosotros
         * no encontramos el QR.
         */
        if (!pago) {
          resultado.noEncontrados++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'NO_ENCONTRADO',
          });

          continue;
        }

        /*
         * Ya fue procesado por webhook,
         * polling u otra conciliación.
         */
        if (pago.estado === 'PAGADO') {
          resultado.yaPagados++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'YA_PAGADO',
          });

          continue;
        }

        /*
         * Si localmente está ANULADO,
         * VENCIDO, etc. pero el Banco
         * dice que existe un pago,
         * no lo cambiamos silenciosamente.
         */
        if (pago.estado !== 'PENDIENTE') {
          resultado.inconsistencias++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'ESTADO_INCONSISTENTE',

            estadoLocal: pago.estado,
          });

          continue;
        }

        /*
         * 3. Validar moneda.
         */
        if (payment.currency !== pago.moneda) {
          resultado.inconsistencias++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'MONEDA_INCORRECTA',

            monedaEsperada: pago.moneda,

            monedaRecibida: payment.currency,
          });

          continue;
        }

        /*
         * 4. Validar monto usando centavos.
         */
        const montoEsperado = Math.round(Number(pago.monto) * 100);

        const montoPagado = Math.round(Number(payment.amount) * 100);

        if (!pago.modify_amount && montoEsperado !== montoPagado) {
          resultado.inconsistencias++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'MONTO_INCORRECTO',

            montoEsperado: pago.monto,

            montoPagado: payment.amount,
          });

          continue;
        }

        /*
         * 5. Todo coincide.
         *
         * PENDIENTE → PAGADO
         */
        const updated = await PagoQrRepository.marcarComoPagado(
          pago.id,
          payment,
        );

        if (updated === 1) {
          resultado.actualizados++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'ACTUALIZADO',
          });
        } else {
          /*
           * Por ejemplo, otro proceso pudo
           * haberlo actualizado al mismo tiempo.
           */
          resultado.yaPagados++;

          resultado.detalles.push({
            qrId: payment.qrId,

            resultado: 'YA_PROCESADO',
          });
        }
      } catch (error) {
        /*
         * No detenemos toda la conciliación.
         */
        resultado.inconsistencias++;

        resultado.detalles.push({
          qrId: payment.qrId || null,

          resultado: 'ERROR',

          message: error.message,
        });

        console.error('[QR CONCILIACIÓN]', {
          qrId: payment.qrId,

          error: error.message,
        });
      }
    }

    return resultado;
  }
}
