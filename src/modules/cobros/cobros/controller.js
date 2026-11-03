import { CreateUseCase } from './use-case/create.use-case.js';

export class CobroController {
  static async create(req, res) {
    const data = await CreateUseCase.execute({ payload: req.validated.body });
    return res
      .status(200)
      .json({ ok: true, message: 'Se creo correctamente el cobro', data });
  }
}
