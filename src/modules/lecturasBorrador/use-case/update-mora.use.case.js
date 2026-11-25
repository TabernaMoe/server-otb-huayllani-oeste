import { LecturaAguaRepository } from '../lectura.respository.js';
import { CobroAguaRepository } from '../../cobrosAgua/cobroAgua.repository.js';
import { sequelize } from '../../../config/database.js';

export class UpdateMoraUseCase {
  static async execute({ id, payload }) {
    return sequelize.transaction(async (t) => {
      const { mora, observacion_mora } = payload;
      const buscarLectura = await LecturaAguaRepository.getById({
        id,
        transaction: t,
      });
      if (!buscarLectura) {
        const err = new Error('No se encontro la lectura');
        err.statusCode = 404;
        throw err;
      }
      if (buscarLectura.mora < 0) {
        const err = new Error('La lectura no tiene mora');
        err.statusCode = 409;
        throw err;
      }

      const actualizarLectura = await LecturaAguaRepository.update({
        id,
        payload: {
          mora,
          observacion_mora,
          puede_editar_mora: false,
        },
        transaction: t,
      });
      const buscarCobro = await CobroAguaRepository.getByLecturaId({
        lectura_id: id,
        transaction: t,
      });
      if (!buscarCobro) {
        const err = new Error('No se encontro el cobro');
        err.statusCode = 404;
        throw err;
      }
      if (buscarCobro.estado !== 'PENDIENTE') {
        const err = new Error(
          'Este proceso esta en procedo de pago no se puede editar',
        );
        err.statusCode = 404;
        throw err;
      }

      await CobroAguaRepository.update({
        id: buscarCobro.id,
        payload: {
          monto_total: buscarCobro.monto_total - mora,
          saldo: buscarCobro.monto_total - mora,
        },
        transaction: t,
      });

      return actualizarLectura;
    });
  }
}
