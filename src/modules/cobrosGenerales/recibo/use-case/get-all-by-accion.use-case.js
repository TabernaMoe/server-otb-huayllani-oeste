import { ReciboRepository } from '../repository.js';

export class GetAllByAccionUseCase {
  static async execute({ accion_id }) {
    const data = await ReciboRepository.getAllByAccion({ accion_id });
    return data;
  }
}
