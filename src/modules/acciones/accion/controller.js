import { GetSelectByServicioUseCase } from './use-case/get-select-by-servicio.use-case.js';

export class AccionController {
  static async getSelectByServicio(req, res) {
    const filtros = req.validated?.query ?? req.validated?.body ?? {};
    const data = await GetSelectByServicioUseCase.execute({
      tipo_servicio: filtros.tipo_servicio,
      search: filtros.search,
    });
    return res
      .status(200)
      .json({ ok: true, message: 'Datos obtenidos correctamente', data });
  }
}
