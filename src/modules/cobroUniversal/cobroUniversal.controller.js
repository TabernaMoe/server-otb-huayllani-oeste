import { CreateUseCase } from './use-case/create.use-case.js';
import { UpdateUseCase } from './use-case/update.use-case.js';
import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { GetByIdUseCase } from './use-case/get-id.use-case.js';

export class CobroUniversalController {
  static async getAll(req, res) {
    const { query } = req.validated;

    const data = await GetAllUseCase.execute({
      limitQuery: query?.limit,
      pageQuery: query?.page,
      searchQuery: query?.search,
    });

    return res.status(200).json({
      ok: true,
      message: 'Cobros obtenidos correctamente',
      ...data,
    });
  }
  static async getById(req, res) {
    const data = await GetByIdUseCase.execute({ id: req.validated.params.id });
    return res.status(200).json({
      ok: true,
      message: 'Cobros obtenidos correctamente',
      data,
    });
  }
  static async create(req, res) {
    const data = await CreateUseCase.execute({
      payload: {
        accion_id: req.validated.body.accion_id,
        concepto: req.validated.body.concepto,
        descripcion: req.validated.body.descripcion,
        monto: req.validated.body.monto,
      },
    });

    return res.status(200).json({
      ok: true,
      message: 'Se creo correctamente el cobro',
      data,
    });
  }
  static async update(req, res) {
    const data = await UpdateUseCase.execute({
      id: req.params.id,
      payload: req.validated.body,
    });

    return res.status(200).json({
      ok: true,
      message: 'Se creo correctamente el cobro',
      data,
    });
  }
}
