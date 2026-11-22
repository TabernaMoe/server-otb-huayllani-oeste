import { CobroReportesRepository } from '../repository.js';

export class GetCobrosPorFechaPorSocioUseCase {
  static async execute({ socio_id, body }) {
    const data = await CobroReportesRepository.getCobrosPorFechaporAcion({
      estado: body.estado,
      fecha_final: body.fecha_final,
      fecha_inicio: body.fecha_inicio,
      tipo_cobro: body.tipo_cobro,
      socio_id,
    });
    return data;
  }
}
