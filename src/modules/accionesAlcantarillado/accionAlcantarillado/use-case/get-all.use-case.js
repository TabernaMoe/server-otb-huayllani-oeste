import { AccionAlcantarilladoRepository } from '../accionAlcantarillado.repository.js';

export class GetAllUseCase {
  static async execute({
    pageQuery,
    limitQuery,
    searchQuery,
    estadoQuery,
    calleQuery,
  }) {
    pageQuery = Number(pageQuery) || 1;
    limitQuery = Number(limitQuery) || 10;
    calleQuery = Number(calleQuery) || null;
    searchQuery =
      searchQuery && searchQuery !== 'null' && searchQuery !== 'undefined'
        ? searchQuery
        : '';

    const data = await AccionAlcantarilladoRepository.getAll({
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
      estado: estadoQuery ?? null,
      calle_id: calleQuery ?? null,
    });
    return data;
  }
}
