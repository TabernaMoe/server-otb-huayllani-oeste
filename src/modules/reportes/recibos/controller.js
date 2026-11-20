import { GetRecibosPorAccionUseCase } from './use-case/get-recibos-por-accion.use-case.js';
import { GetRecibosPorFechaPorAccionUseCase } from './use-case/get-recibos-por-fecha-por-accion.use-case.js';
import { GetRecibosPorFechaUseCase } from './use-case/get-recibos-por-fecha.use-case.js';
import { GetRecibosUseCase } from './use-case/get-recibos.use-case.js';

export class ReciboReporteController {
  static async getRecibos(req, res) {
    const data = await GetRecibosUseCase.execute({
      query: req.validated.query,
    });
    return res.status(200).json({ ok: true, data });
  }
  static async getRecibosPorFecha(req, res) {
    const data = await GetRecibosPorFechaUseCase.execute({
      body: req.validated.body,
    });
    return res.status(200).json({ ok: true, data });
  }
  static async getRecibosPorAccion(req, res) {
    const data = await GetRecibosPorAccionUseCase.execute({
      accion_id: req.validated.params.id,
      query: req.validated.query,
    });
  }
  static async GetRecibosPorFechaPorAccion(req, res) {
    const data = await GetRecibosPorFechaPorAccionUseCase.execute({
      body: req.validated.body,
      accion_id: req.validated.params.id,
    });
    return res.status(200).json({ ok: true, data });
  }
}
