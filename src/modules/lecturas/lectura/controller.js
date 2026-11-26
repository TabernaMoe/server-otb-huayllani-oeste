import { CreateUseCase } from './use-case/create.use-case.js';
import { GetAllUseCase } from './use-case/get-all.use-case.js';

export class LecturaController {
  static async getAll(req, res) {
    const data = await GetAllUseCase.execute();
    return res.status(200).json({ ok: true, data });
  }
  static async create(req, res) {
    const data = await CreateUseCase.execute({
      accion_id: req.validated.params.id,
      payload: req.validated.body,
    });
    return res.status(200).json({ ok: true, data });
  }
}
