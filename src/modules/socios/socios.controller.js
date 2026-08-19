import { SocioServices as services } from './socios.services.js';

export class SocioController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = req.query.search;
      let estado = req.query.estado;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      if (estado === 'true') {
        estado = true;
      } else if (estado === 'false') {
        estado = false;
      } else {
        estado = undefined;
      }

      const result = await services.getAll(page, limit, search, estado);

      return res.status(200).json({
        ok: true,
        message: 'Socios obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getSelect(req, res, next) {
    try {
      let search = req.query.search;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getSelect(search);

      return res.status(200).json({
        ok: true,
        message: 'Socios obtenidos correctamente',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const { id } = req.params;

      const idNumber = Number(id);

      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un número entero');
        throw err;
      }
      const dato = await services.getId(id);
      return res
        .status(200)
        .json({ ok: true, message: 'Socio obtenido correctamente', dato });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const payload = req.body;
      const { id } = req.usuario;
      const dataCreated = await services.create(id, payload);
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

      const idNumber = Number(id);

      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un número entero');
        throw err;
      }
      const dataUpdated = await services.update(id, payload);
      return res.status(200).json({
        ok: true,
        message: 'Socio actuzalizado correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;

      const idNumber = Number(id);

      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un número entero');
        throw err;
      }
      const dataToggled = await services.cambiarEstado(id);
      return res.status(200).json({
        ok: true,
        ...dataToggled,
      });
    } catch (e) {
      next(e);
    }
  }
}
