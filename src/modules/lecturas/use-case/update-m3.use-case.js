import { LecturaAguaRepository } from '../lectura.respository.js';
import { TarifaRespository } from '../../tarifa/tarifa.repository.js';
import { AccionAguaAlcantarillado } from '../../acciones/accionesAgua/accion.repository.js';
import { CobroAguaRepository } from '../../cobrosAgua/cobroAgua.repository.js';
import { sequelize } from '../../../config/database.js';

export class UpdateM3UseCase {
  static async execute({ id, payload }) {
    return sequelize.transaction(async (t) => {
      const { consumo_m3, observacion_modificacion } = payload;

      const buscarLectura = await LecturaAguaRepository.getById({
        id,
        transaction: t,
      });
      if (!buscarLectura) {
        const err = new Error('No se encontro la lectura');
        err.statusCode = 404;
        throw err;
      }

      const buscarAccion = await AccionAguaAlcantarillado.getAccionById({
        id: buscarLectura.accion_id,
        transaction: t,
      });

      if (!buscarAccion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      const buscarTarifa = await TarifaRespository.getTarifaById({
        id: buscarAccion.tarifa_id,
        transaction: t,
      });
      if (!buscarTarifa) {
        const err = new Error('No se encontro la tarifa');
        err.statusCode = 404;
        throw err;
      }
      let consumoRestante = consumo_m3;
      let total_pagar = 0;
      for (const rango of buscarTarifa.rangosTarifa) {
        if (consumoRestante <= 0) break;

        const minimo = Number(rango.consumo_minimo);
        const maximo = Number(rango.consumo_maximo);
        const precio = Number(rango.precio);

        const cantidadRango = maximo - minimo;
        const consumoCobrado = Math.min(consumoRestante, cantidadRango);

        total_pagar += consumoCobrado * precio;
        consumoRestante -= consumoCobrado;
      }

      const actualizarLectura = await LecturaAguaRepository.update({
        id,
        payload: {
          consumo_m3,
          precio: total_pagar,
          pude_editar_m3: false,
          observacion_modificacion,
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
        payload: { monto_total: total_pagar, saldo: total_pagar },
        transaction: t,
      });
      return actualizarLectura;
    });
  }
}
