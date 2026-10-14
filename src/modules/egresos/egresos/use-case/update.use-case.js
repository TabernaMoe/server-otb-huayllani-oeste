import { EgresosRespository } from '../repository.js';

export class UpdateUseCase {
  static async execute({ id, payload }) {
    if (!payload?.categoria_egreso_id) {
      const buscarCategoria = await CategoriaGastosRespository.getById({
        id: payload.categoria_egreso_id,
      });
      if (!buscarCategoria) {
        const err = new Error('No se encontor el gasto');
        err.statusCode = 404;
        throw err;
      }
    }
    const data = await EgresosRespository.update({ id, payload });
    if (!data) {
      const err = new Error('No se pudo actualizar el gasto');
      err.statusCode = 500;
      throw err;
    }
    return data;
  }
}
