import { TipoAccionRepository } from '../repository.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    const data = await TipoAccionRepository.update({ id, payload });
    if (!data) {
      const err = new Error('No se encontro el tipo de accion');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
