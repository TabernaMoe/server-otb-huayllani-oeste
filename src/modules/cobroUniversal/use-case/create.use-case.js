import { CobroAguaRepository } from '../../cobros/cobrosAgua.repository.js';

import { PeriodoRepository } from '../../gestiones/periodo/periodo.repository.js';
import { AccionAguaAlcantarillado } from '../../acciones/accionesAgua/accion.repository.js';
import { sequelize } from '../../../config/database.js';

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
          saldo: monto,
        },
        transaction: t,
      });

      return createCobro;
    });
  }
}
