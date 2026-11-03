import { AccionAguaRepository } from '../repository.js';

export class GetByIdUseCase {
  static async execute({ id }) {
    const data = await AccionAguaRepository.getById({ id });
    if (!data) {
      const err = new Error('No se encontro la accion');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
