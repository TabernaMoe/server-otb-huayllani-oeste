import { AccionAlcantarilladoRepository } from '../accionAlcantarillado.repository.js';
import { DetalleAlcantarilladoRepository } from '../../detalleAlcantarillado/detalleAlcantarillado.repository.js';
import { CobroAlcantarilladoRepository } from '../../cobrosAlcantarillado/cobroAlcantarillado.repository.js';
import { tipoCobroAlcantarillado } from '../../cobrosAlcantarillado/tiposCobrosAlcantarillado/tipoCobro.repository.js';
import { SocioRepository } from '../../../socios/socio.repository.js';
import { CalleRepository } from '../../../calleRamal/calle.repository.js';
import { PeriodoRepository } from '../../../gestiones/periodo/periodo.repository.js';
import { sequelize } from '../../../../config/database.js';

export class CreateUseCase {
  static async execute({ payload }) {
    return sequelize.transaction(async (t) => {
      const { socio_id, calle_id, detalles, ...parent } = payload;
      const buscarSocio = await SocioRepository.getById({
        id: socio_id,
        transaction: t,
      });
      if (!buscarSocio) {
        const err = new Error('No se encontro al socio');
        err.statusCode = 404;
        throw err;
      }
      const buscarCalle = await CalleRepository.getById({
        id: calle_id,
        transaction: t,
      });

      if (!buscarSocio) {
        const err = new Error('No se encontro la calle');
        err.statusCode = 404;
        throw err;
      }
      if (!buscarCalle) {
        const err = new Error('No se encontro la calle');
        err.statusCode = 404;
        throw err;
      }
      const ultimaAccion = await AccionAlcantarilladoRepository.getUltimaAccion(
        { transaction: t },
      );
      const nuevoCodigo = ultimaAccion
        ? Number(ultimaAccion.codigo_interno) + 1
        : 1;
      //aumentar e codigo interno
      const crearAccion = await AccionAlcantarilladoRepository.create({
        payload: {
          socio_id,
          calle_id,
          codigo_interno: nuevoCodigo,
          ...parent,
        },
        transaction: t,
      });

      //devuelve id ,nombre_acion, precio_accion
      const detalleAccionData =
        await DetalleAlcantarilladoRepository.asignarDetallesAccion({
          idAccion: crearAccion.id,
          detalles: detalles,
          transaction: t,
        });

      if (!detalleAccionData) {
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

      for (const row of detalleAccionData) {
        const createCobro = await CobroAlcantarilladoRepository.create({
          payload: {
            socio_id,
            accion_id: crearAccion.id,
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

      return crearAccion;
    });
  }
}
