import { CobroAguaRepository } from '../../cobros/cobrosAgua.repository.js';

export class GetByIdUseCase {
  static async execute({ id }) {
    const data = await CobroAguaRepository.getById({ id });
    if (!data) {
      const err = new Error('No se encontro el cobro');
      err.statusCode = 404;
      throw err;
    }
    return {
      accion_id: data.accion_id,
      concepto: data.concepto,
      descripcion: data.descripcion,
      monto_total: data.monto_total,
    };
  }
}
