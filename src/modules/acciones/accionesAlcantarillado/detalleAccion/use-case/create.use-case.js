import { DetalleAccionRepository } from '../repository.js';

export class CreateUseCase {
  static async execute({ payload }) {
    const { tipo_accion_id, nombre_accion, ...parent } = payload;

    const buscarDobleNombre = await DetalleAccionRepository.getByName({
      nombre_accion,
      tipo_accion_id,
    });
    if (buscarDobleNombre) {
      const err = new Error('Ya existe un un registro con ese nombre');
      err.statudCode = 409;
      throw err;
    }
    const crearDetalle = await DetalleAccionRepository.create({ payload });

    return crearDetalle;
  }
}
