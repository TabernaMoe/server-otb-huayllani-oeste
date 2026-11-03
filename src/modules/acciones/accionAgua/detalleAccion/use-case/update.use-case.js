import { DetalleAccionRepository } from '../repository.js';
import { TipoAccionRepository } from '../../tipoAccion/repository.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    const { tipo_accion_id, nombre_accion } = payload;

    if (tipo_accion_id) {
      const buscarTipoAccion = await TipoAccionRepository.getById({
        id: tipo_accion_id,
      });
      if (!buscarTipoAccion) {
        const err = new Error('No se encontro el tipo de accion');
        err.statudCode = 404;
        throw err;
      }
    }
    if (nombre_accion) {
      const buscarDobleNombre = await DetalleAccionRepository.getByName({
        nombre_accion,
        tipo_accion_id,
      });
      if (buscarDobleNombre) {
        const err = new Error('Ya existe un un registro con ese nombre');
        err.statudCode = 409;
        throw err;
      }
    }

    const actualizarDetalle = await DetalleAccionRepository.update({
      id,
      payload,
    });

    return actualizarDetalle;
  }
}
