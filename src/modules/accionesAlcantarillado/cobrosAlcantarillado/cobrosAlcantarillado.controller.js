import { GetHistorialByAccionUseCase } from './use-case/get-historial-accion.use-case.js';
import { GetHistorialBySocioUseCase } from './use-case/get-historial-socio.use-case.js';
import { GetPendientesByAccionUseCase } from './use-case/get-pendientes-accion.use-case.js';
import { GetPendientesBySocioUseCase } from './use-case/get-pendientes-socio.use-case.js';
import { PagarCobroUseCase } from './use-case/pagar-cobros.use-case.js';

export class CobrosAlcantarilladoController {
  static async getPendientesBySocio(req, res) {
    const data = await GetPendientesBySocioUseCase.execute({
      socio_id: req.params.id,
    });
    return res.status(200).json({
      ok: true,
      message: 'Corbos pendientes obtenidos correctamente',
      data,
    });
  }
  static async getPendientesByAccion(req, res) {
    const data = await GetPendientesByAccionUseCase.execute({
      accion_id: req.params.id,
    });
    return res.status(200).json({
      ok: true,
      message: 'Cobros pendientes obtenidos correctamente',
      data,
    });
  }
  static async getHistorialByAccion(req, res) {
    const data = await GetHistorialByAccionUseCase.execute({
      accion_id: req.params.id,
      limitQuery: req.validated.limit,
      pageQuery: req.validated.page,
      searchQuery: req.validated.search,
    });
    return res.status(200).json({
      ok: true,
      message: 'Historial de cobros obtenidos correctamente',
      data,
    });
  }
  static async getHistorialBySocio(req, res) {
    const data = await GetHistorialBySocioUseCase.execute({
      socio_id: req.params.id,
      limitQuery: req.validated.limit,
      pageQuery: req.validated.page,
      searchQuery: req.validated.search,
    });
    return res.status(200).json({
      ok: true,
      message: 'Historial de cobros  obtenidos correctamente',
      data,
    });
  }
  static async pagar(req, res) {
    const data = await PagarCobroUseCase.execute({
      payload: req.validated.body,
    });
    return res.status(200).json({
      ok: true,
      message: 'Se pago correctamente todo lo seleccionado',
      data,
    });
  }
}
