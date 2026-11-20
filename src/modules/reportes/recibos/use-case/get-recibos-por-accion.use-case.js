import { ReciboReporteRepository } from '../repository.js';

export class GetRecibosPorAccionUseCase {
  static async execute({ accion_id, query }) {
    const data = await ReciboReporteRepository.getRecibosPorAccion({
      estado: query?.estado,
      search: query?.search,
      tipo_cobro: query?.tipo_cobro,
      limit: query?.limit,
      page: query?.page,
      accion_id,
    });
    return data;
  }
}
