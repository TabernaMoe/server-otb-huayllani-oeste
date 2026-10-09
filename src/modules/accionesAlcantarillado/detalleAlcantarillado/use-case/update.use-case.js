import { DetalleAlcantarilladoRepository } from '../detalleAlcantarillado.repository.js';

class UpdateUseCase {
  static async execute({ id, payload }) {
    const dobleNombre = await DetalleAlcantarilladoRepository.getByNombre({
      nombre_accion: payload.nombre_accion,
    });
    if (dobleNombre) {
      const err = new Error('Ya existe un registro con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const data = await DetalleAlcantarilladoRepository.update({ id, payload });

    if (!data) {
      const err = new Error('No se encontro el registro');
      err.statusCode = 404;
      throw err;
    }

    return data;
  }
}

export default UpdateUseCase;
