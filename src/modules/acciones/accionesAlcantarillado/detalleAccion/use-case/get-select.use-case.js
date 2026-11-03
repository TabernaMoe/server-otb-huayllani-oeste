import { DetalleAccionRepository } from '../repository.js';

export class GetSelectUseCase {
  static async execute() {
    const data = await DetalleAccionRepository.getSelect();
    return data;
  }
}
