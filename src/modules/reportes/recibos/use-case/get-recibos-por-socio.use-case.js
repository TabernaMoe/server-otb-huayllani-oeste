import { ReciboReporteRepository } from '../repository.js';

export class GetRecibosPorSocioUseCase {
  static async execute({ socio_id, query }) {
    const data = await ReciboReporteRepository.getRecibosPorSocio({
      estado: query?.estado,
      search: query?.search,
      tipo_cobro: query?.tipo_cobro,
      limit: query?.limit,
      page: query?.page,
      socio_id,
    });
    return data;
  }
}
