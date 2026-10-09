import { CobroAlcantarilladoRepository } from '../cobroAlcantarillado.repository.js';

export class GetHistorialByAccionUseCase {
  static async execute({ accion_id, pageQuery, limitQuery, searchQuery }) {
    pageQuery = Number(pageQuery) || 1;
    limitQuery = Number(limitQuery) || 10;
    searchQuery =
      searchQuery && searchQuery !== 'null' && searchQuery !== 'undefined'
        ? searchQuery
        : '';
    const data = await CobroAlcantarilladoRepository.getHitorialByAccion({
      accion_id,
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
    });
    return data;
  }
}
