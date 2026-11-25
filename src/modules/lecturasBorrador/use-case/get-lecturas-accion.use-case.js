import { LecturaAguaRepository } from '../lectura.respository.js';

export class GetLecturasByAccionUseCase {
  static async execute({ accion_id }) {
    const data = await LecturaAguaRepository.getLecturasByAccion({ accion_id });
    return data;
  }
}
