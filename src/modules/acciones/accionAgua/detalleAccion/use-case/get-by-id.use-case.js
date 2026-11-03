import { DetalleAccionRepository } from '../repository.js';

export class GetByIdUseCase {
  static async execute({ id }) {
    const data = await DetalleAccionRepository.getById({ id });
    if (!data) {
      return null;
    }
    return data;
  }
}
