import { PagoQrService } from './pagoQr.services.js';

export class PagoQrController {
  static async listar(req, res, next) {
    try {
      const { page, limit, estado } = req.query;

      const result = await PagoQrService.listar({
        page,
        limit,
        estado,
      });

      return res.status(200).json({
        ok: true,

        data: result.data,

        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  static async generar(req, res, next) {
    try {
      const { amount, description, dueDate, currency, branchCode } = req.body;

      const pagoQr = await PagoQrService.generarQr({
        amount,
        description,
        dueDate,
        currency,
        branchCode,
      });

      return res.status(201).json({
        success: true,
        message: 'QR generado correctamente',
        data: pagoQr,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verificarEstado(req, res, next) {
    try {
      const { id } = req.params;

      const data = await PagoQrService.verificarEstado(id);

      return res.status(200).json({
        ok: true,
        message: 'Estado del QR consultado correctamente',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async obtenerPorId(req, res, next) {
    try {
      const data = await PagoQrService.obtenerPorId(req.params.id);

      return res.status(200).json({
        ok: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async conciliar(req, res, next) {
    try {
      const { fecha } = req.params;

      const resultado = await PagoQrService.conciliarPagos(fecha);

      return res.status(200).json({
        ok: true,

        message: 'Conciliación QR realizada correctamente',

        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}
