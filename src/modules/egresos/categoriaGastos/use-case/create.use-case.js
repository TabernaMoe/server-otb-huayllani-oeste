import { CategoriaGastosRespository } from '../repository.js';

export class CreateUseCase {
  static async execute({ payload }) {
    const data = await CategoriaGastosRespository.create({ payload });
    return data;
  }
}
