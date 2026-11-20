import { CobroReportesRepository } from '../repository.js';

export class GetCobrosUseCase {
  static async execute({ query }) {
    const data = await CobroReportesRepository.getCobros({
      estado: query?.estado,
      limit: query?.limit,
      page: query?.page,
      search: query?.search,
      tipo_cobro: query?.tipo_cobro,
    });
    return data;
  }
}
