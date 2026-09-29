import { AccionAguaAlcantarillado } from '../accion.repository.js';
import { detalleAccionRepository } from '../../detalleAccion/AccionDetalle.repository.js';
import { AccionDetalleRepository } from '../../accionDetalleAgua/accionDetalle.repository.js';
import { sequelize } from '../../../../config/database.js';
import { PeriodoRepository } from '../../../gestiones/periodo/periodo.repository.js';
import { CobroAccionAguaRepository } from '../../cobroAccionAgua/CobroAccionAgua.respository.js';
import { TipoCobroRepository } from '../../cobroAccionAgua/tipoCobro/TipoCobro.respository.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    return sequelize.transaction(async (t) => {
      const {
        //   calle_id,
        //   tarifa_id,
        //   nro_medidor,
        //   direccion,
        //   observacion,
        //   estado,
        detallesAccion = [],
        ...parent
      } = payload;
      const accionUpdated = await AccionAguaAlcantarillado.udpate({
        id,
        payload: parent,
        transaction: t,
      });
      if (!accionUpdated) {
        const err = new Error('No se encontro las accion');
        err.statusCode = 404;
        throw err;
      }

      const buscarDetalles = await detalleAccionRepository.getByArray({
        ids: detallesAccion,
        transaction: t,
      });
      if (!buscarDetalles) {
        const err = new Error('No se encontro las accion');
        err.statusCode = 404;
        throw err;
      }

      if (detallesAccion.length > 0) {
        const { idsRemove, idsAdd } = await AccionDetalleRepository.getCambios({
          accion_id: id,
          dataNew: detallesAccion,
          transaction: t,
        });
        console.log('***********');
        console.log(idsAdd);
        console.log('***********');

        if (idsRemove?.length !== 0) {
          const dateRemove = await AccionDetalleRepository.deleteArray({
            data: idsRemove,
            transaction: t,
          });

          if (!dateRemove) {
            const err = new Error('No se pudeo eliminar los detalles');
            err.statusCode = 404;
            throw err;
          }
        }

        if (idsAdd?.length > 0) {
          const dataAdd = await AccionDetalleRepository.createByArray({
            accion_id: id,
            data: idsAdd,
            transaction: t,
          });

          const buscarPeriodoActual = await PeriodoRepository.getPeriodoActual({
            transaction: t,
          });

          if (!buscarPeriodoActual) {
            const err = new Error('No existe periodo actual');
            err.statusCode = 409;
            throw err;
          }

          for (const row of dataAdd) {
            const createCobro = await CobroAccionAguaRepository.create({
              payload: {
                socio_id: accionUpdated.socio_id,
                accion_id: accionUpdated.id,
                periodo_id: buscarPeriodoActual.id,
                tipo_cobro: 'ACCION',
                concepto: 'COMPRA DE ACCION',
                descripcion: `COMPRA DE ${row.nombre_accion}`,
                monto_total: row.precio_accion,
                saldo: row.precio_accion,
              },
              transaction: t,
            });
            await TipoCobroRepository.createAccionDetalle({
              payload: {
                accion_id: accionUpdated.id,
                cobro_id: createCobro.id,
                accion_detalle_id: row.id,
                precio: row.precio_accion,
              },
              transaction: t,
            });
          }
        }
      }
      return accionUpdated;
    });
  }
}
