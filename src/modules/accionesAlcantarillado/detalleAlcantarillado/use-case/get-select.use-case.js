import { DetalleAlcantarilladoRepository } from '../detalleAlcantarillado.repository.js';

class GetSelectUseCase {
  static async execute({ searchQuery = '' }) {
    searchQuery = searchQuery.trim() || '';
    const data = await DetalleAlcantarilladoRepository.getSelect({
      search: searchQuery,
    });
    return data;
  }
}
export default GetSelectUseCase;
