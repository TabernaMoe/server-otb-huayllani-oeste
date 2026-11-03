import { CalleRepository } from '../../../../calleRamal/calle.repository.js';
import { SocioRepository } from '../../../../socios/socio.repository.js';
import { TarifaRespository } from '../../../../tarifa/tarifa.repository.js';
import { DetalleAccionRepository } from '../../detalleAccion/repository.js';
import { AccionDetalleRepository } from '../../accionDetalle/repository.js';
import { AccionAguaRepository } from '../repository.js';
import { CobroRepository } from '../../../../cobrosGenerales/cobro/repository.js';
import { CobroAccionRespository } from '../../../../cobrosGenerales/tipoCobro/CobroAccion.repository.js';
import { PeriodoRepository } from '../../../../gestiones/periodo/periodo.repository.js';
import { sequelize } from '../../../../../config/database.js';

export class CreateUseCase {
  static async execute({ payload }) {
    const {
      socio_id,
      calle_id,
      tarifa_id,
      detallesAccion = [],
      ...parent
    } = payload;
    return sequelize.transaction(async (t) => {
      const buscarSocio = await SocioRepository.getById({
        id: socio_id,
        transaction: t,
      });
      if (!buscarSocio) {
        const err = new Error('No se encontro el socio');
        err.statusCode = 404;
        throw err;
      }
      const buscarCalle = await CalleRepository.getById({
        id: calle_id,
        transaction: t,
      });
      if (!buscarCalle) {
        const err = new Error('No se encontro la calle');
        err.statusCode = 404;
        throw err;
      }

      const buscaTarifa = await TarifaRespository.getById({
        id: tarifa_id,
        transaction: t,
      });

      if (!buscaTarifa) {
        const err = new Error('No se encontro la calle');
        err.statusCode = 404;
        throw err;
      }

      const buscarDetallesAccion = await DetalleAccionRepository.getByArrayIds({
        detallesAccion,
        transaction: t,
      });

      if (!buscarDetallesAccion) {
        const err = new Error('No se encontro algunos detalles accion');
        err.statusCode = 404;
        throw err;
      }

      const ultimaAccion = await AccionAguaRepository.getUltimaAccion({
        transaction: t,
      });
      const nuevoCodigo = ultimaAccion
        ? Number(ultimaAccion.codigo_interno) + 1
        : 1;
      const crearAccion = await AccionAguaRepository.create({
        payload: {
          socio_id,
          calle_id,
          tarifa_id,
          codigo_interno: nuevoCodigo,
          ...parent,
        },
        transaction: t,
      });

      await AccionDetalleRepository.createByArray({
        payload: detallesAccion.map((row) => ({
          accion_id: crearAccion.id,
          detalle_accion_id: row,
        })),
        transaction: t,
      });

      const periodoActual = await PeriodoRepository.getPeriodoActual({
        transaction: t,
      });

      const obtenerAccionDetalle =
        await AccionDetalleRepository.getAccionDetalleWithDetalle({
          accion_id: crearAccion.id,
          transaction: t,
        });

      for (let row of obtenerAccionDetalle) {
        const crearCobro = await CobroRepository.create({
          payload: {
            socio_id,
            accion_id: crearAccion.id,
            periodo_id: periodoActual.id,
            tipo_cobro: 'ACCION_AGUA',
            concepto: 'COBRO DE ACCION DE AGUA',
            descripcion: `${row.nombre_accion}`,
            monto_total: row.precio_accion,
            saldo: row.precio_accion,
          },
          transaction: t,
        });

        await CobroAccionRespository.create({
          payload: {
            cobro_id: crearCobro.id,
            accion_detalle_id: row.id,
            precio: row.precio_accion,
          },
          transaction: t,
        });
      }
      return crearAccion;
    });
  }
}
