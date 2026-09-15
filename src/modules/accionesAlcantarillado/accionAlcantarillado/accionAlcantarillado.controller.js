import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { GetIdUseCase } from './use-case/get-id.use-case.js';
import { CreateUseCase } from './use-case/create.use-case.js';
import { UpdateUseCase } from './use-case/update.use-case.js';
import { ChangeStatusUseCase } from './use-case/change-status.case-use.js';

export class AcccionAlcantarilladoController {
  static async getAll(req, res, next) {
    try {
      const { query } = req.validated;

      const data = await GetAllUseCase.execute({
        calleQuery: query?.calle_id,
        estadoQuery: query?.estado,
        limitQuery: query?.limit,
        pageQuery: query?.page,
        searchQuery: query?.search,
      });

      return res.status(200).json({
        ok: true,
        message: 'Acciones obtenidas correctamente',
        ...data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const { params } = req.validated;

      const data = await GetIdUseCase.execute({ id: params.id });
      return res
        .status(200)
        .json({ ok: true, message: 'Accion obtenida correctamente', data });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const { body } = req.validated;
      const data = await CreateUseCase.execute({ payload: body });
      return res.status(200).json({
        ok: true,
        message: 'Accion creada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    try {
      const { params, body } = req.validated;
      const data = await UpdateUseCase.execute({
        id: params.id,
        payload: body,
      });
      return res.status(200).json({
        ok: true,
        message: 'Accion actualizada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async changeStatus(req, res, next) {
    try {
      const { params } = req.validated;
      await ChangeStatusUseCase.execute({ id: params.id });
      return res.status(200).json({
        ok: true,
        message: 'Se cambio correctamente el estado de la accion',
      });
    } catch (e) {
      next(e);
    }
  }
}
