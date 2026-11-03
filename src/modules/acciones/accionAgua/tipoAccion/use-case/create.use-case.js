import { TipoAccionRepository } from '../repository.js';

export class CreateUseCase {
  static async execute({ payload }) {
    const data = await TipoAccionRepository.create({ payload });
    return data;
  }
}
