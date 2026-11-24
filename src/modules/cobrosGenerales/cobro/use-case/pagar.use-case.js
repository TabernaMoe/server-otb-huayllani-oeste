import { CobroRepository } from '../repository.js';
import { PagoRepository } from '../../pago/respository.js';
import { PagoDetalleRepository } from '../../pagoDetalle/repository.js';
import { ReciboRepository } from '../../recibo/repository.js';
import { sequelize } from '../../../../config/database.js';

export class PagarUseCase {
  static async execute({ cobros = [], monto, metodo_pago }) {
    return sequelize.transaction(async (t) => {
      const montoPago = Number(monto);

      if (!montoPago || montoPago <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const buscarCobros = await CobroRepository.getCobrosByIdsByEstado({
        cobros,
        estado: ['PENDIENTE', 'PARCIAL'],
        transaction: t,
      });

      if (buscarCobros) {
        const err = new Error(
          'Algunos cobros no existen, no pertenecen al socio o ya están pagados',
        );
        err.statusCode = 404;
        throw err;
      }
      const totalPendiente = buscarCobros.reduce((total, cobro) => {
        return total + Number(cobro.saldo || 0);
      }, 0);
      if (buscarCobros.length === 1) {
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

      const crearPago = await PagoRepository.create({
        payload: {
          monto_pagado: montoPago,
          metodo_pago,
          fecha_pago: new Date(),
        },
        transaction: t,
      });

      for (let cobro of buscarCobros) {
        const saldoActual = Number(cobro.saldo || 0);
        let montoAplicado = saldoActual;

        if (buscarCobros.length === 1) {
          montoAplicado = montoPago;
        }

        const nuevoMontoPagado =
          Number(cobro.monto_pagado || 0) + montoAplicado;

        const nuevoSaldo = saldoActual - montoAplicado;

        const nuevoEstado = nuevoSaldo === 0 ? 'PAGADO' : 'PARCIAL';

        const actualizarCobro = await CobroRepository.update({
          id: cobro.id,
          payload: {
            monto_pagado: nuevoMontoPagado,
            saldo: nuevoSaldo,
            estado: nuevoEstado,
          },
          transaction: t,
        });
        if (!actualizarCobro) {
          const err = new Error('No se encontro el cobro');
          err.statusCode = 404;
          throw err;
        }
        await PagoDetalleRepository.create({
          payload: {
            cobro_id: cobro.id,
            pago_id: crearPago.id,
            monto: montoAplicado,
          },
          transaction: t,
        });
      }

      const numeroRecibo = Math.floor(10000000 + Math.random() * 90000000);

      await ReciboRepository.create({
        payload: {
          pago_id: crearPago.id,
          fecha_emision: new Date(),
          numero_recibo: numeroRecibo,
        },
        transaction: t,
      });
    });
  }
}
