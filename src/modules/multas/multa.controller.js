import { MultaServices as services } from './multa.services.js';

export class MultasController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = req.query.search;
      let estado = req.query.estado;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      if (estado === 'true') {
        estado = true;
      } else if (estado === 'false') {
        estado = false;
      } else {
        estado = undefined;
      }

      const result = await services.getAll(page, limit, search, estado);

      return res.status(200).json({
        ok: true,
        message: 'Multas obtenidas correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async geSelect(req, res, next) {
    try {
      let search = req.query.search;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getSelect(search);

      return res.status(200).json({
        ok: true,
        message: 'Multas obtenidas correctamente para el select',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const payload = req.body;
      const data = await services.create(payload);
      return res.status(200).json({
        ok: true,
        message: 'Multa creada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const data = await services.update(id, payload);
      return res.status(200).json({
        ok: true,
        message: 'Multa actuzalizada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      await services.changeStatus(id);
      return res.status(200).json({
        ok: true,
        message: 'Se cambio su estado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
