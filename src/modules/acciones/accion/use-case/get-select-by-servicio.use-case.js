import { AccionRepository } from '../repository.js';

export class GetSelectByServicioUseCase {
  static async execute({ tipo_servicio }) {
    const data = await AccionRepository.getSelectByServicio({ tipo_servicio });
    return data;
  }
}
