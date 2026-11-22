import { CobroReportesRepository } from '../repository.js';

export class GetCobrosSocioUseCase {
  static async execute({ socio_id, query }) {
    const data = await CobroReportesRepository.getCobrosPorSocio({
      estado: query?.estado,
      limit: query?.limit,
      page: query?.page,
      search: query?.search,
      tipo_cobro: query?.tipo_cobro,
      socio_id,
    });
    return data;
  }
}
