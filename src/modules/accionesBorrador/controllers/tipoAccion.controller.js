import { tipoAccionServices as services } from '../services/tipoAccion.services.js';

export class TipoAccionController {
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
        message: 'Tipo accion creado correctamente',
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
        message: 'Detalle accion actuzalizada correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getSelect(req, res, next) {
    try {
      const data = await services.getSelect();
      return res.status(200).json({
        ok: true,
        message: 'Tipos accion obtenidos correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}
