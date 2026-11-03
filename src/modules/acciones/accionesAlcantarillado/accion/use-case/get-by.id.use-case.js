import { AccionAlcantarilladoRepository } from '../repository.js';

export class GetByIdUseCase {
  static async execute({ id }) {
    const data = await AccionAlcantarilladoRepository.getByIdWithDetallesCobros(
      { id },
    );
    if (!data) {
      const err = new Error('No se encontro la accion');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
