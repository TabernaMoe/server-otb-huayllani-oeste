import { AccionRepository } from '../repository.js';

export class GetSelectByServicioUseCase {
  static async execute({ tipo_servicio, search }) {
    const data = await AccionRepository.getSelectByServicio({
      tipo_servicio,
      search,
    });
    return data;
  }
}
