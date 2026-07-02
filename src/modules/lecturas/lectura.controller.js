import { LecturaServices as services } from './lectura.services.js';

export class LecturaController {
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
        message: 'Lecutra obtenida correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;

      if (isNaN(id) && !Number.isInteger(id)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      const data = await services.create(id, payload);

      return res.status(200).json({
        ok: true,
        message: 'Lectura creada correctamente',
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

      if (isNaN(id) && !Number.isInteger(id)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      const data = await services.update(id, payload);

      return res.status(200).json({
        ok: true,
        message: 'Lectura actualizada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async ChangeMedidor(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;

      if (isNaN(id) && !Number.isInteger(id)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      const data = await services.ChangeMedidor(id, payload);

      return res.status(200).json({
        ok: true,
        message: 'Lectura actualizada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}
