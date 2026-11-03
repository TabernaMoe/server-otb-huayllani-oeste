import { TipoAccionRepository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = await TipoAccionRepository.getAll();
    return data;
  }
}
