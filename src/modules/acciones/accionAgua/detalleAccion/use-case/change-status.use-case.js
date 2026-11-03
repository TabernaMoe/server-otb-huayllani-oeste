import { DetalleAccionRepository } from '../repository.js';

export class ChangeStatusUseCase {
  static async execute({ id }) {
    const data = await DetalleAccionRepository.chageStatus({ id });
    if (!data) {
      const err = new Error('No se encontro el detalle');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
