import { DetalleAlcantarilladoRepository } from '../detalleAlcantarillado.repository.js';

class CreateUseCase {
  static async execute({ payload }) {
    const dobleNombre = await DetalleAlcantarilladoRepository.getByNombre({
      nombre_accion: payload.nombre_accion,
    });
    if (dobleNombre) {
      const err = new Error('Ya existe un registro con ese nombre');
      err.statusCode = 404;
      throw err;
    }
    const data = await DetalleAlcantarilladoRepository.create({ payload });
    return data;
  }
}
export default CreateUseCase;
