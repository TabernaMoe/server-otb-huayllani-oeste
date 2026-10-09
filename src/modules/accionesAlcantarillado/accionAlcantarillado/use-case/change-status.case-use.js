import { AccionAlcantarilladoRepository } from '../accionAlcantarillado.repository.js';

export class ChangeStatusUseCase {
  static async execute({ id }) {
    const data = await AccionAlcantarilladoRepository.changeStatus({
      id,
    });

    if (!data) {
      const err = new Error('No se encontro la accion');
      err.statusCode = 404;
      throw err;
    }

    return data;
  }
}
