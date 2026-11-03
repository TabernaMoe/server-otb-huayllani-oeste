import { AccionAlcantarilladoRepository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = AccionAlcantarilladoRepository.getAll();
    return data;
  }
}
