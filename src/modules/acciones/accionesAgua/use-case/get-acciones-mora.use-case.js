import { AccionAguaAlcantarillado } from '../accion.repository.js';

export class GetAccionesWithMoraUseCase {
  static async execute() {
    const data = await AccionAguaAlcantarillado.getAccionesWithMora();
    return data;
  }
}
