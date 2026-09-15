import { CalleRepository } from '../calle.repository.js';

export class GetSelectUseCase {
  static async execute({ searchQuery = '' }) {
    searchQuery =
      searchQuery && searchQuery !== 'undefined' && searchQuery !== 'null'
        ? searchQuery.trim()
        : '';
    const data = await CalleRepository.getSelect({
      search: searchQuery,
    });
    return data;
  }
}
