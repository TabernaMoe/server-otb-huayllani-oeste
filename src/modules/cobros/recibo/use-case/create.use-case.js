import { ReciboRepository } from '../repository.js';
import { CobroRepository } from '../../cobros/repository.js';
import { PagoDetalleAguaRepository } from '../../pagoDetalle/pagoDetalleAgua.repository.js';
import { PagoAguaRepository } from '../../pago/PagoAgua.repository.js';
import { AccionRepository } from '../../../acciones/accion/repository.js';
import { PeriodoRepository } from '../../../gestiones/periodo/periodo.repository.js';
import { sequelize } from '../../../../config/database.js';

export class CreateUseCase {
  static async execute({ payload }) {
    return sequelize.transaction(async (t) => {
      const { accion_id, concepto, descripcion, monto } = payload;
      const buscarAccion = await AccionRepository.getById({
        id: accion_id,
        transaction: t,
      });
      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      const periodoAcutal = await PeriodoRepository.getPeriodoActual();

      const crearCobro = await CobroRepository.create({
        payload: {
          socio_id: buscarAccion.socio_id,
          accion_id: buscarAccion.id,
          periodo_id: periodoAcutal.id,
          tipo_cobro: 'OTRO',
          concepto,
          descripcion,
          monto_total,
          saldo,
        },
        transaction: t,
      });
    });
  }
}
