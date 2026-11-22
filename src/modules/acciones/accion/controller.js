import { GetSelectByServicioUseCase } from './use-case/get-select-by-servicio.use-case.js';

export class AccionController {
  static async getSelectByServicio(req, res) {
    const data = await GetSelectByServicioUseCase.execute({
      tipo_servicio: req.validated.query.tipo_servicio,
      search: req.validated.query.search,
    });
    return res
      .status(200)
      .json({ ok: true, message: 'Datos obtenidos correctamente', data });
  }
}
