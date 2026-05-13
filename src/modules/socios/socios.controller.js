import { SocioServices as services } from './socios.services.js';

export class SocioController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = String(req.query.search) || '';

      const estado =
        req.query.estado && req.query.estado !== 'undefined'
          ? req.query.estado.trim().toUpperCase()
          : '';

      const result = await services.getAll(page, limit, search, estado);

      return res.status(200).json({
        ok: true,
        message: 'Socios obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAllDeleteds(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = String(req.query.search) || '';

      const result = await services.getAllDeleteds(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Socios obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const { id } = req.params;
      const dato = await services.getId(id);
      return res
        .status(200)
        .json({ ok: true, message: 'Socio obtenido correctamente', dato });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const payload = req.body;
      const dataCreated = await services.create(payload);
      return res
        .status(200)
        .json({ ok: true, message: 'Socio creado correctamente', dataCreated });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const dataUpdated = await services.update(id, payload);
      return res.status(200).json({
        ok: true,
        message: 'Socio actuzalizado correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const dataDeleted = await services.delete(id);
      return res.status(200).json({
        ok: true,
        ...dataDeleted,
      });
    } catch (e) {
      next(e);
    }
  }
  static async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const dataToggled = await services.toggleStatus(id);
      return res.status(200).json({
        ok: true,
        message: 'Estado del socio actualizado correctamente',
        dataToggled,
      });
    } catch (e) {
      next(e);
    }
  }
  static async restore(req, res, next) {
    try {
      const { id } = req.params;
      const dataRestored = await services.restore(id);
      return res.status(200).json({
        ok: true,
        message: 'Socio restaurado correctamente',
        dataRestored,
      });
    } catch (e) {
      next(e);
    }
  }
}
