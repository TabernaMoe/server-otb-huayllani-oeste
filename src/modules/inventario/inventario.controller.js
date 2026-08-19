import { InventarioServices as services } from '../inventario/invetario.services.js';

export class InventarioController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = req.query.search;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getAll(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Datos obtenidos correctamente',
        ...result,
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
        message: 'Dato creado correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      if (!Number.isInteger(Number(id))) {
        const err = new Error('ID inválido');
        err.statusCode = 400;
        throw err;
      }
      const payload = req.body;
      const data = await services.update(id, payload);
      return res.status(200).json({
        ok: true,
        message: 'Dato actuzalizado correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async sumar(req, res, next) {
    const { id } = req.params;
    try {
      if (!Number.isInteger(Number(id))) {
        const err = new Error('ID inválido');
        err.statusCode = 400;
        throw err;
      }
      await services.sumar(Number(id));
      return res.status(200).json({
        ok: true,
        message: 'Se incremento correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
  static async restar(req, res, next) {
    const { id } = req.params;
    try {
      if (!Number.isInteger(Number(id))) {
        const err = new Error('ID inválido');
        err.statusCode = 400;
        throw err;
      }
      await services.restar(Number(id));
      return res.status(200).json({
        ok: true,
        message: 'Se decremento correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
