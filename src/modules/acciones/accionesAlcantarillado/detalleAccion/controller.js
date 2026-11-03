import { ChangeStatusUseCase } from './use-case/change-status.use-case.js';
import { CreateUseCase } from './use-case/create.use-case.js';
import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { GetSelectUseCase } from './use-case/get-select.use-case.js';
import { UpdateUseCase } from './use-case/update.use-case.js';
import { GetByIdUseCase } from './use-case/get-by-id.use-case.js';

export class DetalleAccionController {
  static async getAll(req, res) {
    const data = await GetAllUseCase.execute();
    return res.status(200).json({
      ok: true,
      message: 'Se obtuvo correctamente los registros',
      data,
    });
  }
  static async getById(req, res) {
    const data = await GetByIdUseCase.execute({ id: req.validated.params.id });
    return res.status(200).json({
      ok: true,
      message: 'Se obtuvo correctamente el registros',
      data,
    });
  }
  static async create(req, res) {
    const data = await CreateUseCase.execute({ payload: req.validated.body });
    return res.status(200).json({
      ok: true,
      message: 'Se obtuvo correctamente los registros',
      data,
    });
  }

  static async update(req, res) {
    const data = await UpdateUseCase.execute({
      payload: req.validated.body,
      id: req.validated.params.id,
    });
    return res.status(200).json({
      ok: true,
      message: 'Se actualizo correctamente el registros',
      data,
    });
  }
  static async changeStatus(req, res) {
    const data = await ChangeStatusUseCase.execute({
      id: req.validated.params.id,
    });
    return res.status(200).json({
      ok: true,
      message: 'Se actualizo correctamente el registros',
      data,
    });
  }
  static async getSelect(req, res) {
    const data = await GetSelectUseCase.execute();
    return res.status(200).json({
      ok: true,
      message: 'Se obtuvo correctamente los registros',
      data,
    });
  }
}
