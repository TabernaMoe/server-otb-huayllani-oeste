import { sequelize } from '../../../../config/database.js';
import { LecturaRespository } from '../repository.js';
import { AccionRepository } from '../../../acciones/accion/repository.js';
import { PeriodoRepository } from '../../../gestiones/periodo/periodo.repository.js';
import { CambioMedidorRepository } from '../../cambioMedidor/repository.js';

export class CreateUseCase {
  static async execute({ accion_id, payload }) {
    return sequelize.transaction(async (t) => {
      const { lectura_actual, observacion } = payload;

      const buscarAccion = await AccionRepository.getByIdByTipoServicio({
        id: accion_id,
        tipo_servicio: 'AGUA',
        transaction: t,
      });

      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }

      const buscarPeriodoActivo = await PeriodoRepository.getPeriodoActual({
        transaction: t,
      });
      if (buscarPeriodoActivo) {
        const err = new Error('No hay un perido activo');
        err.statusCode = 404;
        throw err;
      }

      const buscarLecturaPeriodo = await LecturaRespository.getLecturaByPeriodo(
        { accion_id, periodo_id: buscarPeriodoActivo.id, transaction: t },
      );
      if (buscarLecturaPeriodo) {
        const err = new Error('No se encontro la letura');
        err.statusCode = 404;
        throw err;
      }

      const buscarUltimaLectura = await LecturaRespository.getUltimaLectura({
        accion_id,
        transaction: t,
      });

      const lecturaAnterior = buscarUltimaLectura
        ? Number(buscarUltimaLectura.lectura_actual)
        : 0;

      let cambioMedidorM3 = 0;

      if (buscarUltimaLectura?.ultimaLectura === 0) {
        const cambio = await CambioMedidorRepository.getByUltimaCambioByLectura(
          { lectura_agua_id: buscarUltimaLectura.id, transaction: t },
        );

        cambioMedidorM3 = cambio ? Number(cambio.consumo_m3) : 0;
      }
    });
  }
}
