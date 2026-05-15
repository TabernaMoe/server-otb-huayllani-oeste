import { tipoAccionServices as services } from '../services/tipoAccion.services.js';

export class AccionController {
  static async getAll(req, res, next) {
    try {
      const data = await services.getAll();

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
      return res.status(200).json({
        ok: true,
        message: 'Acciones obtenido correctamente',
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
        message: 'Acciones creado correctamente',
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
        message: 'Acciones actuzalizado correctamente',
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
        message: 'Acciones eliminado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
