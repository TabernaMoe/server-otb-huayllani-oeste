import { GetAllByNameUseCase } from './use-case/get-all-by-name.use-case.js';

export class BeneficiarioController {
  static async getAllByName(req, res) {
    const data = await GetAllByNameUseCase.execute({
      search: req?.validated?.query?.search,
    });
    return res.status(200).json({
      ok: true,
      message: 'Se obtuvo correctamente los beneficiarios',
      data,
    });
  }
}
