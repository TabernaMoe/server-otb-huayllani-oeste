import { GetCobrosBySocioUseCase } from './use-case/get-cobros-by-socio-use-case.js';
import { GetCobrosByAccionUseCase } from './use-case/get-cobros-by-accion.use-case.js';

export class CobroController {
  static async getCobrosBySocio(req, res) {
    const data = await GetCobrosBySocioUseCase.execute({
      socio_id: req.validated.params.id,
      tipo_cobro: req.validated.query.tipo_cobro,
    });
    return res.status(200).json({ ok: true, data });
  }
  static async getCobrosByAccion(req, res) {
    const data = await GetCobrosByAccionUseCase.execute({
      accion_id: req.validated.params.id,
      tipo_cobro: req.validated.query.tipo_cobro,
    });
    return res.status(200).json({ ok: true, data });
  }
}
