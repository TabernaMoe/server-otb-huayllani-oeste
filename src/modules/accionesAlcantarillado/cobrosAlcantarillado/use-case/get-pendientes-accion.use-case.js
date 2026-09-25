import { CobroAlcantarilladoRepository } from '../cobroAlcantarillado.repository.js';

export class GetPendientesByAccionUseCase {
  static async execute({ accion_id }) {
    const data = await CobroAlcantarilladoRepository.getPendinentesByAccion({
      accion_id,
    });
    return data;
  }
}
