import { CategoriaGastosRespository } from '../repository.js';

export class GetSelectUseCase {
  static async execute() {
    const data = await CategoriaGastosRespository.getSelect();
    return data;
  }
}
