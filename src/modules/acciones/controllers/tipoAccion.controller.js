import { tipoAccionServices as services } from '../services/tipoAccion.services.js';

export class AccionController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search?.toString() || '';

      const result = await services.getAll(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'tipoAcciones obtenidos correctamente',
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
      return res.status(200).json({
        ok: true,
        message: 'tipoAcciones obtenido correctamente',
        dato,
      });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const payload = req.body;
      const dataCreated = await services.create(payload);
      return res.status(200).json({
        ok: true,
        message: 'tipoAcciones creado correctamente',
        ...dataCreated,
      });
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
        message: 'tipoAcciones actuzalizado correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const dataDelete = await services.delete(id);
      return res.status(200).json({
        ok: true,
        message: 'tipoAcciones eliminado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
