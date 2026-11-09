import { ReciboRepository } from '../repository.js';

export class GetAllBySocioUseCase {
  static async execute({ socio_id }) {
    const data = await ReciboRepository.getAllBySocio({ socio_id });
    return data;
  }
}
