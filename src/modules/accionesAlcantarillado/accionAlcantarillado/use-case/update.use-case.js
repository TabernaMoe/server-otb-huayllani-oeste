import { AccionAlcantarilladoRepository } from '../accionAlcantarillado.repository.js';
import { DetalleAlcantarilladoRepository } from '../../detalleAlcantarillado/detalleAlcantarillado.repository.js';
import { CalleRepository } from '../../../calleRamal/calle.repository.js';
import { PeriodoRepository } from '../../../gestiones/periodo/periodo.repository.js';
import { CobroAlcantarilladoRepository } from '../../cobrosAlcantarillado/cobroAlcantarillado.repository.js';
import { tipoCobroAlcantarillado } from '../../cobrosAlcantarillado/tiposCobrosAlcantarillado/tipoCobro.repository.js';

import { sequelize } from '../../../../config/database.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    return sequelize.transaction(async (t) => {
      const { calle_id, direccion, observacion, detalles = [] } = payload;

      const buscarAccion = await AccionAlcantarilladoRepository.getById({
        id,
        transaction: t,
      });
      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      let data = {};
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
        data.calle_id = calle_id;
      }
      if (direccion) {
        data.direccion = direccion;
      }
      if (observacion) {
        data.observacion = observacion;
      }

      if (detalles.length > 0) {
        const { idsRemove, idsAdd } =
          await DetalleAlcantarilladoRepository.editarDetallesAccion({
            idAccion: id,
            detalles,
            transaction: t,
          });

        if (idsRemove?.length !== 0) {
          const dateRemove =
            await DetalleAlcantarilladoRepository.eliminarDetallesAccion({
              detalles: idsRemove,
              transaction: t,
            });
          if (!dateRemove) {
            const err = new Error('No se pudeo eliminar los detalles');
            err.statusCode = 404;
            throw err;
          }
        }

        if (idsAdd?.length !== 0) {
          const dataAdd =
            await DetalleAlcantarilladoRepository.asignarDetallesAccion({
              idAccion: id,
              detalles: idsAdd,
              transaction: t,
            });

          if (!dataAdd) {
            const err = new Error('Algunos detalles accion no exiten');
            err.statusCode = 409;
            throw err;
          }

          const buscarPeriodoActual = await PeriodoRepository.getPeriodoActual({
            transaction: t,
          });
          if (!buscarPeriodoActual) {
            const err = new Error('No existe periodo actual');
            err.statusCode = 409;
            throw err;
          }

          for (const row of dataAdd) {
            const createCobro = await CobroAlcantarilladoRepository.create({
              payload: {
                socio_id: buscarAccion.socio_id,
                accion_id: buscarAccion.id,
                periodo_id: buscarPeriodoActual.id,
                tipo_cobro: 'ACCION',
                concepto: 'COMPRA DE ACCION',
                descripcion: `COMPRA DE ${row.nombre_accion}`,
                monto_total: row.precio_accion,
                saldo: row.precio_accion,
              },
              transaction: t,
            });
            await tipoCobroAlcantarillado.createAccionAlcantarillado({
              payload: {
                cobro_id: createCobro.id,
                accion_detalle_alcantarillado_id: row.id,
                precio: row.precio_accion,
              },
              transaction: t,
            });
          }
        }
      }

      const dataUpdate = await AccionAlcantarilladoRepository.update({
        id,
        payload: data,
        transaction: t,
      });

      return dataUpdate;
    });
  }
}
