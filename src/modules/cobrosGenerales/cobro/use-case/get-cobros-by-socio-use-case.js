import { CobroRepository } from '../repository.js';

export class GetCobrosBySocioUseCase {
  static async execute({ socio_id, tipo_cobro }) {
    const data = CobroRepository.getCobrosBySocio({ socio_id, tipo_cobro });
    return data;
  }
}
