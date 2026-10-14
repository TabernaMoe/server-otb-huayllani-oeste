import { EgresosRespository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = await EgresosRespository.getAll();
    return data;
  }
}
