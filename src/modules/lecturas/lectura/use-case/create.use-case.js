import { sequelize } from '../../../../config/database.js';
import { LecturaRespository } from '../repository.js';
import { AccionRepository } from '../../../acciones/accion/repository.js';
import { PeriodoRepository } from '../../../gestiones/periodo/periodo.repository.js';
import { CambioMedidorRepository } from '../../cambioMedidor/repository.js';
import { TarifaRespository } from '../../../tarifa/tarifa.repository.js';
import { CobroRepository } from '../../../cobrosGenerales/cobro/repository.js';
import { calcularTarifaAgua } from '../../../../helpers/calcularTarifaAgua.js';

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
      if (!buscarPeriodoActivo) {
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

      if (buscarUltimaLectura && lecturaAnterior === 0) {
        const cambio = await CambioMedidorRepository.getByUltimaCambioByLectura(
          { lectura_agua_id: buscarUltimaLectura.id, transaction: t },
        );

        cambioMedidorM3 = cambio ? Number(cambio.consumo_m3) : 0;
      }

      const lecturaActual = Number(lectura_actual);

      if (lecturaActual < lecturaAnterior) {
        const err = new Error(
          'La lectura actual no puede ser menor a la anterior',
        );
        err.statusCode = 400;
        throw err;
      }

      const consumoM3 = lecturaActual - lecturaAnterior + cambioMedidorM3;

      const buscarTarifa = await TarifaRespository.getTarifaById({
        id: buscarAccion.tarifa_id,
        transaction: t,
      });
      if (!buscarTarifa) {
        const err = new Error('No se encontró la tarifa');
        err.statusCode = 404;
        throw err;
      }

      const total_pagar = calcularTarifaAgua(
        consumoM3,
        buscarTarifa.rangosTarifa,
      );

      const crearLectura = await LecturaRespository.create({
        payload: {
          accion_id: buscarAccion.id,
          periodo_id: buscarPeriodoActivo.id,
          lectura_anterior: lecturaAnterior,
          lectura_actual: Number(lectura_actual),
          consumo_m3: consumoM3,
          precio: total_pagar,
          periodo: buscarPeriodoActivo.mes,
          observacion,
        },
        transaction: t,
      });

      if (total_pagar > 0) {
        await CobroRepository.create({
          payload: {
            socio_id: buscarAccion.socio_id,
            accion_id: buscarAccion.id,
            periodo_id: buscarPeriodoActivo.id,
            tipo_cobro: 'LECTURA_AGUA',
            concepto: `LECTURA DEL MES ${buscarPeriodoActivo.mes}`,
            descripcion: `LECTURA DEL MES ${buscarPeriodoActivo.mes}`,
            monto_total: total_pagar,
            saldo: total_pagar,
          },
          transaction: t,
        });
      }

      return crearLectura;
    });
  }
}
