import { EgresosRespository } from '../repository.js';

export class GetByIdUseCase {
  static async execute({ id }) {
    const data = await EgresosRespository.getById({ id });
    if (!data) {
      const err = new Error('No se encotro el egreso');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
