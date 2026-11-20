import { CobroReportesRepository } from '../repository.js';

export class GetCobrosAccionUseCase {
  static async execute({ accion_id, query }) {
    const data = await CobroReportesRepository.getCobroPorAccion({
      estado: query?.estado,
      limit: query?.limit,
      page: query?.page,
      search: query?.search,
      tipo_cobro: query?.tipo_cobro,
      accion_id,
    });
    return data;
  }
}
