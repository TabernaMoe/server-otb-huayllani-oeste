import { LecturaAguaRepository } from '../lectura.respository.js';
import { AccionAguaRepository } from '../../acciones/accionAgua/accion/repository.js';
import { PeriodoRepository } from '../../gestiones/periodo/periodo.repository.js';
import { CambioMedidorRepository } from '../cambio-medidor/repository.js';
import { sequelize } from '../../../config/database.js';

export class CreateUseCase {
  static async execute({ accion_id, payload }) {
    return sequelize.transaction(async (t) => {
      const { lectura_actual, observacion } = payload;

      const buscarAccion = await AccionAguaRepository.getById({
        id: accion_id,
        transaction: t,
      });
      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }

      const buscarUltimaLectura =
        await LecturaAguaRepository.getLecturasByAccion({
          accion_id,
          transaction: t,
        });

      const buscarPeriodoActivo = await PeriodoRepository.getPeriodoActual({
        transaction: t,
      });

      if (!buscarPeriodoActivo) {
        const err = new Error('No hay un periodo activo');
        err.statusCode = 400;
        throw err;
      }

      if (
        buscarUltimaLectura &&
        buscarUltimaLectura.periodo_id === buscarPeriodoActivo.id
      ) {
        const err = new Error('Ya existe una lectura para el periodo actual');
        err.statusCode = 409;
        throw err;
      }

      const lecturaAnterior = buscarUltimaLectura
        ? Number(buscarUltimaLectura.lectura_actual)
        : 0;
      let cambioMedidorM3 = 0;

      if (lecturaAnterior?.ultimaLectura === 0) {
        const cambio = await CambioMedidorRepository.getByLectura({
          lectura_agua_id: buscarUltimaLectura.id,
          transaction: t,
        });

        cambioMedidorM3 = cambio ? Number(cambio.consumo_m3) : 0;
      }
    });
  }
}
