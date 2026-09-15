import { DetalleAlcantarilladoRepository } from '../detalleAlcantarillado.repository.js';
class ChageStatusUseCase {
  static async execute({ id }) {
    const data = DetalleAlcantarilladoRepository.changeStatus({ id });

    if (!data) {
      const err = new Error('No se encontro el registro');
      err.statusCode = 404;
      throw err;
    }

    return data;
  }
}

export default ChageStatusUseCase;
