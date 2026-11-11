import { CobroAguaRepository } from '../../cobros/cobrosAgua.repository.js';

export class GetAllUseCase {
  static async execute({ pageQuery, limitQuery, searchQuery }) {
    pageQuery = Number(pageQuery) || 1;
    limitQuery = Number(limitQuery) || 10;
    searchQuery =
      searchQuery && searchQuery !== 'null' && searchQuery !== 'undefined'
        ? searchQuery
        : '';

    const data = await CobroAguaRepository.getAll({
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
    });
    return data;
  }
}
