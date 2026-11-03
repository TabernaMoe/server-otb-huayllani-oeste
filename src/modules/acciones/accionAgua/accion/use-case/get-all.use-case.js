import { AccionAguaRepository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = AccionAguaRepository.getAll();
    return data;
  }
}
