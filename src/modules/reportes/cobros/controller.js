import { GetCobrosAccionUseCase } from './use-case//get-cobro-por-acion.use-case.js';
import { GetCobrosPorFechaUseCase } from './use-case/get-cobro-por-fecha.use-case.js';
import { GetCobrosPorFechaPorAccionUseCase } from './use-case/get-cobros-por-fecha-por-accion.use-case.js';
import { GetCobrosUseCase } from './use-case/get-cobros.use-case.js';

export class CobroReportesController {
  static async getCobros(req, res) {
    const data = GetCobrosUseCase.execute({ query: req.validated.query });
    return res.status(200).json({ ok: true, data });
  }
  static async getcobrosPorFecha(req, res) {
    const data = GetCobrosPorFechaUseCase.execute({ body: req.validated.body });
    return res.status(200).json({ ok: true, data });
  }
  static async getCobrosAccion(req, res) {
    const data = await GetCobrosAccionUseCase.execute({
      accion_id: req.validated.params.id,
      query: req.validated.query,
    });
    return res.status(200).json({ ok: true, data });
  }
  static async getCobrosPorFechaPorAccion(req, res) {
    const data = await GetCobrosPorFechaPorAccionUseCase.execute({
      accion_id: req.validated.params.id,
      body: req.validated.body,
    });
    return res.status(200).json({ ok: true, data });
  }
}
