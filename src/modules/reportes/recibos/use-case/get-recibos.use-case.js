import { ReciboReporteRepository } from '../repository.js';

export class GetRecibosUseCase {
  static async execute({ query }) {
    const data = await ReciboReporteRepository.getRecibos({
      estado: query?.estado,
      search: query?.search,
      tipo_cobro: query?.tipo_cobro,
      limit: query?.limit,
      page: query?.page,
    });
    return data;
  }
}
