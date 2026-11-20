import { ReciboReporteRepository } from '../repository.js';

export class GetRecibosPorFechaUseCase {
  static async execute({ body }) {
    const data = await ReciboReporteRepository.getRecibosPorFecha({
      estado: body.estado,
      fecha_final: body.fecha_final,
      fecha_inicio: body.fecha_inicio,
      tipo_cobro: body.tipo_cobro,
    });
    return data;
  }
}
