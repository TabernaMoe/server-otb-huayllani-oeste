import { DetalleAccionRepository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = await DetalleAccionRepository.getAll();
    return data;
  }
}
