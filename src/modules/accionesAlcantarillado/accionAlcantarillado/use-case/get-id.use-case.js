import { AccionAlcantarilladoRepository } from '../accionAlcantarillado.repository.js';

export class GetIdUseCase {
  static async execute({ id }) {
    const data = await AccionAlcantarilladoRepository.getById({ id });
    if (!data) {
      const err = new Error('No se encontro la accion de alcantarilado');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
