import { LecturaAguaRepository } from '../lectura.respository.js';

export class UpdateOnlyLecturaUseCase {
  static async execute({ id, payload }) {
    const data = await LecturaAguaRepository.update({ id, payload });
    if (!data) {
      const err = new Error('No se pudo actualizar la lectura');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}
