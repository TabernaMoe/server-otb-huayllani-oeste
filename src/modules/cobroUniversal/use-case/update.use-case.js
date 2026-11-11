import { CobroAguaRepository } from '../../cobros/cobrosAgua.repository.js';
import { AccionAguaAlcantarillado } from '../../acciones/accionesAgua/accion.repository.js';
import { sequelize } from '../../../config/database.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    return sequelize.transaction(async (t) => {
      const { accion_id, concepto, descripcion, monto } = payload;
      const buscarCobro = await CobroAguaRepository.getById({
        id,
        transaction: t,
      });
      if (buscarCobro.estado !== 'PENDIENTE') {
        const err = new Error('No se puede actualizar el cobro');
        err.statusCode = 404;
        throw err;
      }
      let data = {};
      if (accion_id) {
        const buscarAccion = await AccionAguaAlcantarillado.getAccionById({
          id: accion_id,
          transaction: t,
        });
        if (!buscarAccion) {
          const err = new Error('No se encontro la accion');
          err.statusCode = 404;
          throw err;
        }
        data.accion_id = accion_id;
      }
      if (concepto) {
        data.concepto = concepto;
      }
      if (descripcion) {
        data.descripcion = descripcion;
      }
      if (monto) {
        data.monto_total = monto;
        data.saldo = monto;
      }
      const updateCobro = await CobroAguaRepository.update({
        id,
        payload: data,
        transaction: t,
      });

      return updateCobro;
    });
  }
}
