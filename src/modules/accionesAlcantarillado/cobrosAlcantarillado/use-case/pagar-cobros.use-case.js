import { CobroAlcantarilladoRepository } from '../cobroAlcantarillado.repository.js';
import { SocioRepository } from '../../../socios/socio.repository.js';
import { PagoAlcantarilladoRepository } from '../pagoAlcantarillado/PagoAlcantarillado.respository.js';
import { PagoDetalleAlcantarilladoRepository } from '../pagoDetalleAlcantarillado/pagoDetalleAlcantarillado.repository.js';
import { ReciboAlcantarilladoRepository } from '../reciboAlcantarillado/reciboAlcantarillado.respository.js';
import { sequelize } from '../../../../config/database.js';

export class PagarCobroUseCase {
  static async execute({ payload }) {
    return sequelize.transaction(async (t) => {
      const { monto, cobros = [], metodo_pago } = payload;

      if (metodo_pago == 'EFECTIVO') {
        if (cobros.length == 1) {
          const cobroData = await CobroAlcantarilladoRepository.getById({
            id: cobros[0],
            transaction: t,
          });

          if (!cobroData) {
            const err = new Error('El cobro no existe');
            err.statusCode = 404;
            throw err;
          }

          const saldo = Number(cobroData.saldo);
          const montoPago = Number(monto);

          if (montoPago <= 0) {
            const err = new Error('El monto debe ser mayor a 0');
            err.statusCode = 409;
            throw err;
          }

          // No puede pagar más de lo que debe
          if (montoPago > saldo) {
            const err = new Error('El pago no puede ser mayor al saldo');
            err.statusCode = 409;
            throw err;
          }

          // Si NO está pagando todo, entonces es un pago parcial
          if (montoPago < saldo && montoPago < 100) {
            const err = new Error(
              'Los pagos parciales no pueden ser menores a 100',
            );
            err.statusCode = 409;
            throw err;
          }

          const cobroPagar = await CobroAlcantarilladoRepository.pagar({
            id: cobroData.id,
            monto_pagado: montoPago,
            transaction: t,
          });

          const pago = await PagoAlcantarilladoRepository.create({
            payload: {
              monto_pagado: montoPago,
              metodo_pago,
            },
            transaction: t,
          });

          await PagoDetalleAlcantarilladoRepository.create({
            payload: {
              cobro_id: cobroPagar.id,
              pago_id: pago.id,
              monto: montoPago,
            },
            transaction: t,
          });

          await ReciboAlcantarilladoRepository.create({
            payload: {
              pago_id: pago.id,
            },
            transaction: t,
          });

          return cobroPagar;
        } else {
          const cobrosData = await CobroAlcantarilladoRepository.getByArrayIds({
            ids: cobros,
            transaction: t,
          });
          if (!cobrosData) {
            const err = new Error('No se encontro algun cobro 12');
            err.statusCode = 404;
            throw err;
          }
          const totalSaldo = cobrosData.reduce((total, item) => {
            return total + Number(item.saldo);
          }, 0);

          if (totalSaldo != monto) {
            const err = new Error(
              'El monto debe ser igual al saldo total de los cobros',
            );
            err.statusCode = 409;
            throw err;
          }

          const pagarCobros = await CobroAlcantarilladoRepository.pagarArray({
            ids: cobros,
            transaction: t,
          });

          const pago = await PagoAlcantarilladoRepository.create({
            payload: {
              monto_pagado: totalSaldo,
              metodo_pago,
            },
            transaction: t,
          });

          await PagoDetalleAlcantarilladoRepository.createArray({
            payload: pagarCobros.map((row) => ({
              pago_id: pago.id,
              cobro_id: row.id,
              monto: row.monto_total,
            })),
            transaction: t,
          });

          await ReciboAlcantarilladoRepository.create({
            payload: {
              pago_id: pago.id,
            },
            transaction: t,
          });
          return pagarCobros;
        }
      }
    });
  }
}
