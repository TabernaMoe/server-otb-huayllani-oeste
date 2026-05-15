import { calleRamalServices as services } from '../services/calleRamal.services.js';

export class AccionController {
  static async getAll(req, res, next) {
    try {
      const result = await services.getAll();
      return res.status(200).json({
        ok: true,
        data: result,
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
        .json({ ok: true, message: 'Calle obtenido correctamente', dato });
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
        message: 'Calle creado correctamente',
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
        message: 'Calle actuzalizado correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const dataDisabled = await services.delete(id);
      return res.status(200).json({
        ok: true,
        message: 'Calle eliminada correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
