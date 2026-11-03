import { TipoAccionRepository } from '../repository.js';

export class GetSelectUseCase {
  static async execute() {
    const data = await TipoAccionRepository.getSelect();
    return data;
  }
}
