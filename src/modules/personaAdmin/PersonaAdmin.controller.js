import { PersonaAdminServices } from './personaAdmin.services.js';

export class PersonaAdminController {
  static async getAll(req, res, next) {
    try {
      const data = await PersonaAdminServices.getAll({
        queryPage: req.query.page,
        queryLimit: req.query.limit,
        querySearch: req.query.search,
        queryEstado: req.query.estado,
      });
      return res.status(200).json({
        ok: true,
        message: 'Se obtuvo los usuarios correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const data = await PersonaAdminServices.getId(req.params.id);
      return res.status(200).json({
        ok: true,
        message: 'Se obtuvo el usuario correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const data = await PersonaAdminServices.create(req.body);
      return res.status(201).json({
        ok: true,
        message: 'Se creo correctamente el usuario',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    try {
      const data = await PersonaAdminServices.update({
        id: req.params.id,
        payload: req.body,
      });
      return res.status(201).json({
        ok: true,
        message: 'Se creo acutalizo correctamente el usuario',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async changeStatus(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }
}
