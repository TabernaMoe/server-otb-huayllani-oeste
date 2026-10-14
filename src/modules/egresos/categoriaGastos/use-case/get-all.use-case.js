import { CategoriaGastosRespository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = await CategoriaGastosRespository.getAll();
    return data;
  }
}
