import { DetalleAccionRepository } from '../repository.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    const { nombre_accion } = payload;

    if (nombre_accion) {
      const buscarDobleNombre = await DetalleAccionRepository.getByName({
        nombre_accion,
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
