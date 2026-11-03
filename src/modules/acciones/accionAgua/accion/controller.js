import { CreateUseCase } from './use-case/create.use-case.js';
import { UpdateUseCase } from './use-case/update.use-case.js';
import { GetByIdUseCase } from './use-case/get-by.id.use-case.js';
import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { ChangeNameUseCase } from './use-case/change-name.use-case.js';

export class AccionAguaController {
  static async getAll(req, res) {
    const data = await GetAllUseCase.execute();
    return res.status(201).json({
      ok: true,
      message: 'Se obtuvo correctamente las acciones',
      data,
    });
  }
  static async getById(req, res) {
    const data = await GetByIdUseCase.execute({ id: req.validated.params.id });
    return res.status(201).json({
      ok: true,
      message: 'Se obtuvo correctamente la accion',
      data,
    });
  }
  static async create(req, res) {
    const data = await CreateUseCase.execute({ payload: req.validated.body });
    return res.status(201).json({
      ok: true,
      message: 'Se creo correctamente la accion',
      data,
    });
  }
  static async update(req, res) {
    const data = await UpdateUseCase.execute({
      id: req.validated.params.id,
      payload: req.validated.body,
    });
    return res.status(201).json({
      ok: true,
      message: 'Se actualizo correctamente la accion',
      data,
    });
  }
  static async changeName(req, res) {
    const data = await ChangeNameUseCase.execute({
      payload: req.validated.body,
    });
    return res.status(201).json({
      ok: true,
      message: 'Se actualizo correctamente la accion',
      data,
    });
  }
}
