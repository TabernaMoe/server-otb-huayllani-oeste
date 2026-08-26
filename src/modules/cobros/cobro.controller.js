import { CobroServices as services } from './cobro.services.js';

export class CobroController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = String(req.query.search);

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getAll(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Cobros obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getHistorialCobros(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = String(req.query.search);

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getHistorialCobros(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Cobros obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getHistorialAccion(req, res, next) {
    try {
      const { id } = req.params;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = String(req.query.search);

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getHistorialAccion(page, limit, search, id);

      return res.status(200).json({
        ok: true,
        message: 'Cobros obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id) && !Number.isInteger(id)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      const data = await services.getId(id);

      return res.status(200).json({
        ok: true,
        message: 'Cobro obtenidos correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async pagarAdmin(req, res, next) {
    try {
      const payload = req.body;

      const data = await services.pagarAdmin(payload);

      return res
        .status(200)
        .json({ ok: true, message: 'Pago registrado correctamente', ...data });
    } catch (e) {
      next(e);
    }
  }
}
