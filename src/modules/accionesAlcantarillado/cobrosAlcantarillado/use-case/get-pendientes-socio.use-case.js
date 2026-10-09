import { CobroAlcantarilladoRepository } from '../cobroAlcantarillado.repository.js';

export class GetPendientesBySocioUseCase {
  static async execute({ socio_id }) {
    const data = await CobroAlcantarilladoRepository.getPendinentesBySocio({
      socio_id,
    });
    return data;
  }
}
