import { CreateUseCase } from './use-case/create.use-case.js';
import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { UpdateUseCase } from './use-case/update.use-case.js';
import { ChangeStatusUseCase } from './use-case/change-status.use-case.js';

export class EgresosController {
  static async getAll(req, res) {
    const data = await GetAllUseCase.execute();
    return res
      .status(200)
      .json({ ok: true, message: 'Se pudo obtener los egreso', data });
  }
  static async create(req, res) {
    const data = await CreateUseCase.execute({ payload: req.validated.body });
    return res
      .status(200)
      .json({ ok: true, message: 'Se pudo crear el egreso', data });
  }
  static async update(req, res) {
    const data = await UpdateUseCase.execute({
      id: req.validated.params.id,
      payload: req.validated.body,
    });
    return res
      .status(200)
      .json({ ok: true, message: 'Se pudo actualizar el egreso', data });
  }
  static async changeStatus(req, res) {
    const data = await ChangeStatusUseCase.execute({
      id: req.validated.params.id,
    });
    return res
      .status(200)
      .json({ ok: true, message: 'Se pudo actualizar el egreso', data });
  }
}
