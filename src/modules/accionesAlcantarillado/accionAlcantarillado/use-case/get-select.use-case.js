import { AccionAlcantarilladoRepository } from '../accionAlcantarillado.repository.js';

export class GetSelectUseCase {
  static async execute() {
    const data = await AccionAlcantarilladoRepository.getSelection();
    return data;
  }
}
