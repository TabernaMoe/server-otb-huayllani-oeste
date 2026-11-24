import { CobroRepository } from '../repository.js';

export class GetCobrosByAccionUseCase {
  static async execute({ accion_id, tipo_cobro }) {
    const data = CobroRepository.getCobroByAccion({
      tipo_cobro,
      accion_id,
    });
    return data;
  }
}
