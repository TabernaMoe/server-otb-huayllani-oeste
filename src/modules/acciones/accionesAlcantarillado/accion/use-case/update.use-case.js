import { CalleRepository } from '../../../../calleRamal/calle.repository.js';
import { TarifaRespository } from '../../../../tarifa/tarifa.repository.js';
import { DetalleAccionRepository } from '../../detalleAccion/repository.js';
import { AccionDetalleRepository } from '../../accionDetalle/repository.js';
import { AccionAlcantarilladoRepository } from '../repository.js';
import { CobroRepository } from '../../../../cobrosGenerales/cobro/repository.js';
import { CobroAccionRespository } from '../../../../cobrosGenerales/tipoCobro/CobroAccion.repository.js';
import { PeriodoRepository } from '../../../../gestiones/periodo/periodo.repository.js';

import { sequelize } from '../../../../../config/database.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    const { calle_id, detallesAccion = [], ...parent } = payload;
    return sequelize.transaction(async (t) => {
      const buscarAccion = await AccionAlcantarilladoRepository.getById({
        id,
        transaction: t,
      });

      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      if (calle_id) {
        const buscarCalle = await CalleRepository.getById({
          id: calle_id,
          transaction: t,
        });
        if (!buscarCalle) {
          const err = new Error('No se encontro la calle');
          err.statusCode = 404;
          throw err;
        }
      }

      const data = {
        calle_id,
        ...parent,
      };

      if (Object.keys(data).length > 0) {
        await AccionAlcantarilladoRepository.update({
          id,
          payload: data,
          transaction: t,
        });
      }
      if (detallesAccion.length > 0) {
        const buscarDetallesAccion =
          await DetalleAccionRepository.getByArrayIds({
            detallesAccion,
            transaction: t,
          });

        if (!buscarDetallesAccion) {
          const err = new Error('No se encontro algunos detalles accion');
          err.statusCode = 404;
          throw err;
        }

        const { aEliminar, aAgregar } =
          await AccionDetalleRepository.getCambios({
            accion_id: id,
            detallesAccion,
            transaction: t,
          });

        if (aEliminar.length > 0) {
          const cobrosAEliminar = await CobroAccionRespository.getCobros({
            payload: aEliminar,
            transaction: t,
          });

          const cobroAccionDelete =
            await CobroAccionRespository.deleteByAccionDetalle({
              payload: aEliminar,
              transaction: t,
            });

          if (aEliminar.length != cobroAccionDelete) {
            const err = new Error('No se pudo eliminar los cobros accion');
            err.statusCode = 409;
            throw err;
          }

          const cobrosDelete = await CobroRepository.deleteByArray({
            payload: cobrosAEliminar,
            transaction: t,
          });
          if (cobrosAEliminar.length != cobrosDelete) {
            const err = new Error('No se pudo eliminar los cobros accion');
            err.statusCode = 409;
            throw err;
          }

          const accionDetalleDelete =
            await AccionDetalleRepository.deleteByArray({
              payload: aEliminar,
              transaction: t,
            });

          if (accionDetalleDelete != aEliminar.length) {
            const err = new Error('No se pudo eliminar los accion detalle');
            err.statusCode = 409;
            throw err;
          }
        }

        if (aAgregar.length > 0) {
          await AccionDetalleRepository.createByArray({
            payload: aAgregar.map((row) => ({
              accion_id: id,
              detalle_accion_id: row,
            })),
            transaction: t,
          });
          const periodoActual = await PeriodoRepository.getPeriodoActual({
            transaction: t,
          });
          const obtenerAccionDetalle =
            await AccionDetalleRepository.getAccionDetalleWithDetalle({
              accion_id: id,
              transaction: t,
            });
          for (let row of obtenerAccionDetalle) {
            const crearCobro = await CobroRepository.create({
              payload: {
                socio_id: buscarAccion.socio_id,
                accion_id: id,
                periodo_id: periodoActual.id,
                tipo_cobro: 'ACCION_ALCANTARILLADO',
                concepto: 'COBRO DE ACCION DE ALCANTARILLADO',
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
        }

        const buscarAccionActualizacion =
          await AccionAlcantarilladoRepository.getById({
            id,
            transaction: t,
          });

        return buscarAccionActualizacion;
      }
    });
  }
}
