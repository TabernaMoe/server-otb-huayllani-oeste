import { DetalleAlcantarilladoRepository } from '../detalleAlcantarillado.repository.js';

class GetAllUseCase {
  static async execute({
    pageQuery = null,
    limitQuery = null,
    searchQuery = null,
    estadoQuery = null,
  }) {
    pageQuery = Number(pageQuery) || 1;
    limitQuery = Number(limitQuery) || 10;

    searchQuery =
      searchQuery && searchQuery !== 'null' && searchQuery !== 'undefined'
        ? searchQuery
        : '';

    estadoQuery =
      estadoQuery && estadoQuery !== 'null' && estadoQuery !== 'undefined'
        ? estadoQuery
        : undefined;

    const data = await DetalleAlcantarilladoRepository.getAll({
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
      estado: estadoQuery,
    });
    return data;
  }
}

export default GetAllUseCase;
