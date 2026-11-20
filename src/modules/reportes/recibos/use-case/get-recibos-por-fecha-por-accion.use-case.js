import { ReciboReporteRepository } from '../repository.js';

export class GetRecibosPorFechaPorAccionUseCase {
  static async execute({ accion_id, body }) {
    const data = await ReciboReporteRepository.getRecibosPorFechaPorAccion({
      estado: body.estado,
      fecha_final: body.fecha_final,
      fecha_inicio: body.fecha_inicio,
      tipo_cobro: body.tipo_cobro,
      accion_id,
    });
    return data;
  }
}
