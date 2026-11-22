import { ReciboReporteRepository } from '../repository.js';

export class GetRecibosPorFechaPorSocioUseCase {
  static async execute({ socio_id, body }) {
    const data = await ReciboReporteRepository.getRecibosPorFechaPorSocio({
      estado: body.estado,
      fecha_final: body.fecha_final,
      fecha_inicio: body.fecha_inicio,
      tipo_cobro: body.tipo_cobro,
      socio_id,
    });
    return data;
  }
}
