import changeStatusUseCase from './use-case/change-status.use-case.js';
import createUseCase from './use-case/create.use-case.js';
import getAllUseCase from './use-case/get-all.use-case.js';
import getSelectUseCase from './use-case/get-select.use-case.js';
import updateUseCase from './use-case/update.use-case.js';

export class DetalleAlcantarilladoController {
  static async getAll(req, res, next) {
    const { query } = req.validated;
    const data = await getAllUseCase.execute({
      estadoQuery: query?.estado,
      limitQuery: query?.limit,
      pageQuery: query?.page,
      searchQuery: query?.search,
    });

    return res.status(200).json({
      ok: true,
      message: 'Detalles alcantarillado obtenidos correctamente',
      ...data,
    });
  }
  static async getSelect(req, res, next) {
    const { query } = req.validated;
    const data = await getSelectUseCase.execute({ searchQuery: query?.search });
    return res
      .status(200)
      .json({ ok: true, message: 'Detalles obtenidos correctamente', data });
  }

  static async create(req, res, next) {
    const { body } = req.validated;
    const dataCreated = await createUseCase.execute({ payload: body });
    return res.status(200).json({
      ok: true,
      message: 'Accion creada correctamente',
      dataCreated,
    });
  }
  static async update(req, res, next) {
    const { params, body } = req.validated;
    const data = await updateUseCase.execute({ id: params.id, payload: body });
    return res.status(200).json({
      ok: true,
      message: 'Detalle accion actuzalizada correctamente',
      data,
    });
  }
  static async cambiarEstado(req, res, next) {
    const { params } = req.validated;

    await changeStatusUseCase.execute({ id: params.id });
    return res.status(200).json({
      ok: true,
      message: 'Se cambio su estado correctamente',
    });
  }
}
