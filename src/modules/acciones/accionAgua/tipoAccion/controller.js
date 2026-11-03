import { CreateUseCase } from './use-case/create.use-case.js';
import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { GetSelectUseCase } from './use-case/get-select.use-case.js';
import { UpdateUseCase } from './use-case/update.use-case.js';

export class ControllerTipoAccion {
  static async getAll(req, res) {
    const data = await GetAllUseCase.execute();
    return res.status(200).json({
      ok: true,
      message: 'Se obtuvo correctamente los tipos de accion',
      data,
    });
  }
  static async create(req, res) {
    const data = await CreateUseCase.execute({ payload: req.validated.body });
    return res.status(200).json({
      ok: true,
      message: 'Se creo correctamente el tipo de accion',
      data,
    });
  }
  static async update(req, res) {
    const data = await UpdateUseCase.execute({
      id: req.validated.params.id,
      payload: req.validated.body,
    });
    return res.status(200).json({
      ok: true,
      message: 'Se actualizo correctamente el tipo de accion',
      data,
    });
  }
  static async getSelect(req, res) {
    const data = await GetSelectUseCase.execute();
    return res
      .status(200)
      .json({
        ok: true,
        message: 'Se obtuvo correctamente los tipos de accion',
        data,
      });
  }
}
