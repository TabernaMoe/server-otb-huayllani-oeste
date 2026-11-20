import { CobroReportesRepository } from '../repository.js';

export class GetCobrosPorFechaUseCase {
  static async execute({ body }) {
    const data = await CobroReportesRepository.getCobrosPorFecha({
      estado: body.estado,
      fecha_final: body.fecha_final,
      fecha_inicio: body.fecha_inicio,
      tipo_cobro: body.tipo_cobro,
    });
    return data;
  }
}
