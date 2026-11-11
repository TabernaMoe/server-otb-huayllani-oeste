import { CategoriaGastosRespository } from '../repository.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    const data = await CategoriaGastosRespository.update({ id, payload });
    if (!data) {
      const err = new Error('No se pudo actualizar el gasto');
      err.statusCode = 500;
      throw err;
    }
    return data;
  }
}
