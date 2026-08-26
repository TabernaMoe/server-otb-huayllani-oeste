import { RolServices as services } from '../services/rol.services.js';

export class RolController {
  static async getAll(req, res, next) {
    try {
      const data = await services.getAll();
      return res.status(200).json({
        ok: true,
        message: 'Roles obtenidos correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getAllPagination(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = req.query.search;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getAllPagination(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Roles obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getPermisos(req, res, next) {
    try {
      const data = await services.getPermissos();
      return res.status(200).json({
        ok: true,
        message: 'Permisos obtenidos correctamente',
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
        .json({ ok: true, message: 'Rol obtenido correctamente', dato });
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
        message: 'Rol actuzalizado correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
}
