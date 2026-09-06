import { AsambleaServices as services } from './asamblea.services.js';

export class AsambleaController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search || '';

      let estado = String(req.query.estado) || undefined;

      if (estado == 'undefined') {
        estado = undefined;
      }

      const result = await services.getAll(page, limit, search, estado);

      return res.status(200).json({
        ok: true,
        message: 'Asamblea obtenidas correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getAcciones(req, res, next) {
    try {
      const { id } = req.params;
      const data = await services.getAcciones(id);
      return res.status(200).json({
        ok: true,
        message: 'Acciones obtenidas correctamente',
        data,
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
        .json({ ok: true, message: 'Asamblea obtenida correctamente', dato });
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
        message: 'Asamblea creada correctamente',
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
        message: 'Asamblea actuzalizada correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async updateAccion(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const dataUpdated = await services.updateAccion(id, payload);
      return res.status(200).json({
        ok: true,
        message: 'Asamblea actuzalizada correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
}
