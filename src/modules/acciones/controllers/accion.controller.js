import { accionServices as services } from '../services/accion.services.js';

export class AccionController {
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
        message: 'Acciones obtenidas correctamente',
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
        .json({ ok: true, message: 'Accion obtenida correctamente', dato });
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
        message: 'Accion creada correctamente',
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
        message: 'Accion actuzalizada correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      let idNumber = Number(id);
      if (isNaN(idNumber) && !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      await services.cambiarEstado(idNumber, payload);
      return res.status(200).json({
        ok: true,
        message: 'Se cambio el estado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAcciones(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await services.getAcciones(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Acciones obtenidas correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
}
