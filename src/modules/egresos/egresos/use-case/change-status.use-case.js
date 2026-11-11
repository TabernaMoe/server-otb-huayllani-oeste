import { EgresosRespository } from '../repository.js';

export class ChangeStatusUseCase {
  static async execute({ id }) {
    const data = await EgresosRespository.changeStatus({ id });
    if (!data) {
      const err = new Error('No se encontro el egreso');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
