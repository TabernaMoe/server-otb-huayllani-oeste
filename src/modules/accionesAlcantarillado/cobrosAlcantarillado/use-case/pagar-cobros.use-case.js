import { CobroAlcantarilladoRepository } from '../cobroAlcantarillado.repository.js';
import { SocioRepository } from '../../../socios/socio.repository.js';
import { PagoAlcantarilladoRepository } from '../pagoAlcantarillado/PagoAlcantarillado.respository.js';
import { PagoDetalleAlcantarilladoRepository } from '../pagoDetalleAlcantarillado/pagoDetalleAlcantarillado.repository.js';
import { ReciboAlcantarilladoRepository } from '../reciboAlcantarillado/reciboAlcantarillado.respository.js';
import { AccionAlcantarilladoRepository } from '../../accionAlcantarillado/accionAlcantarillado.repository.js';
import { fechaBonita } from '../../../../utils/funciones.js';
import { sequelize } from '../../../../config/database.js';

export class PagarCobroUseCase {
  static async execute({ payload }) {
    return sequelize.transaction(async (t) => {
      const { monto, cobros = [], metodo_pago } = payload;

      if (metodo_pago == 'EFECTIVO') {
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

        const reciboCreated = await ReciboAlcantarilladoRepository.create({
          payload: {
            pago_id: pago.id,
          },
          transaction: t,
        });

        const buscarSocio = await SocioRepository.getById({
          id: pagarCobros[0].socio_id,
          transaction: t,
        });
        const buscarAccion = await AccionAlcantarilladoRepository.getById({
          id: pagarCobros[0].accion_id,
          transaction: t,
        });

        const reciboEnvar = {
          socio: `${buscarSocio.ci_socio} ${buscarSocio.nombres} ${buscarSocio.primer_apellido} ${buscarSocio.segundo_apellido}`,
          codigo_interno: buscarAccion.codigo_interno,
          numero_recibo: reciboCreated.numero_recibo,
          fecha_emision: fechaBonita(reciboCreated.createdAt),
          monto_pagado: pago.monto_pagado,
          metodo_pago: pago.metodo_pago,
          cobros_pagados: pagarCobros.map((row) => ({
            descripcion: row.descripcion,
            monto_pagado: row.monto_pagado,
          })),
        };

        return reciboEnvar;
      }
      if (metodo_pago == 'QR') {
      }
    });
  }
}
