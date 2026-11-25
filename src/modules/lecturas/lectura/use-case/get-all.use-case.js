import { LecturaRespository } from '../repository.js';

export class GetAllUseCase {
  static async execute() {
    const data = await LecturaRespository.getAll();
    return data;
  }
}
