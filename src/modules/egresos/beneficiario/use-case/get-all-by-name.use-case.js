import { BeneficiarioRepository } from '../repository.js';

export class GetAllByNameUseCase {
  static async execute({ search = '' }) {
    const data = await BeneficiarioRepository.getAllByName({ search });
    return data;
  }
}
