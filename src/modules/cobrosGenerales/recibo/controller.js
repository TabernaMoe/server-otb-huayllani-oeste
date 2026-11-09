import { GetAllUseCase } from './use-case/get-all.use-case.js';
import { GetAllByAccionUseCase } from './use-case/get-all-by-accion.use-case.js';
import { GetAllBySocioUseCase } from './use-case/get-all-by.socio.use-case.js';

export class ReciboController {
  static async getAll(req, res) {
    const data = await GetAllUseCase.execute();
    return res
      .status(200)
      .json({ ok: true, message: 'Se obtuvo los recibos correctamente', data });
  }
  static async getAllByAccion(req, res) {
    const data = await GetAllByAccionUseCase.execute({
      accion_id: req.validated.params.id,
    });
    return res
      .status(200)
      .json({ ok: true, message: 'Se obtuvo los recibos correctamente', data });
  }
  static async getAllBySocio(req, res) {
    const data = await GetAllByAccionUseCase.execute({
      accion_id: req.validated.params.id,
    });
    return res
      .status(200)
      .json({ ok: true, message: 'Se obtuvo los recibos correctamente', data });
  }
}
