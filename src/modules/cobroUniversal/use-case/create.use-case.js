import { CobroAguaRepository } from '../../cobros/cobrosAgua.repository.js';

import { PagoAguaRepository } from '../../acciones/cobroAccionAgua/PagoAccion.repository.js';
import { PagoDetalleAguaRepository } from '../../acciones/cobroAccionAgua/PagoDetalle.repository.js';
import { ReciboAguaRepository } from '../../acciones/cobroAccionAgua/Recibo.repository.js';

import { PeriodoRepository } from '../../gestiones/periodo/periodo.repository.js';
import { AccionAguaAlcantarillado } from '../../acciones/accionesAgua/accion.repository.js';
import { sequelize } from '../../../config/database.js';
import { SocioRepository } from '../../socios/socio.repository.js';

import { fechaBonita } from '../.././../utils/funciones.js';

export class CreateUseCase {
  static async execute({ payload }) {
    return sequelize.transaction(async (t) => {
      const { accion_id, concepto, descripcion, monto } = payload;
      const buscarAccion = await AccionAguaAlcantarillado.getAccionById({
        id: accion_id,
        transaction: t,
      });
      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      const buscarSocio = await SocioRepository.getById({
        id: buscarAccion.socio_id,
        transaction: t,
      });

      const buscarPeriodoActual = await PeriodoRepository.getPeriodoActual({
        transaction: t,
      });
      if (!buscarPeriodoActual) {
        const err = new Error('No hay periodo activo');
        err.statusCode = 404;
        throw err;
      }
      const createCobro = await CobroAguaRepository.create({
        payload: {
          socio_id: buscarAccion.socio_id,
          accion_id: buscarAccion.id,
          periodo_id: buscarPeriodoActual.id,
          tipo_cobro: 'OTRO',
          concepto,
          descripcion,
          monto_total: monto,
          monto_pagado: monto,
          saldo: 0,
          estado: 'PAGADO',
        },
        transaction: t,
      });

      const createPago = await PagoAguaRepository.create({
        payload: {
          monto_pagado: monto,
          metodo_pago: 'EFECTIVO',
        },
        transaction: t,
      });

      await PagoDetalleAguaRepository.create({
        payload: {
          cobro_id: createCobro.id,
          pago_id: createPago.id,
          monto: monto,
        },
        transaction: t,
      });

      const reciboCreate = await ReciboAguaRepository.create({
        payload: {
          pago_id: createPago.id,
        },
        transaction: t,
      });

      const reciboEnvar = {
        socio: `${buscarSocio.ci_socio} ${buscarSocio.nombres} ${buscarSocio.primer_apellido} ${buscarSocio.segundo_apellido}`,
        codigo_interno: buscarAccion.codigo_interno,
        numero_recibo: reciboCreate?.numero_recibo || 10,
        fecha_emision: fechaBonita(reciboCreate.createdAt),
        monto_pagado: createPago.monto_pagado,
        metodo_pago: createPago.metodo_pago,
        cobros_pagados: [
          {
            descripcion: createCobro.descripcion,
            monto_pagado: createCobro.monto_pagado,
          },
        ],
      };

      return reciboEnvar;
    });
  }
}
