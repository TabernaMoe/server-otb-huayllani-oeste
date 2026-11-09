import { ReciboRepository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = await ReciboRepository.getAll();
    return data;
  }
}
