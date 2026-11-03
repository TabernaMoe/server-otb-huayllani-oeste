import { DetalleAccionRepository } from '../repository.js';

export class GetSelectByTipoUseCase {
  static async execute({ tipo_accion_id }) {
    const data = await DetalleAccionRepository.getSelectBytipo({
      id: tipo_accion_id,
    });
    return data;
  }
}
