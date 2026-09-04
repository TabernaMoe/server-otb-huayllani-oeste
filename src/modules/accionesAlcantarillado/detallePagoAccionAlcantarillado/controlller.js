import { Services } from './services.js';

export class Controller {
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

      const result = await Services.getAll(page, limit, search, estado);

      return res.status(200).json({
        ok: true,
        message: 'Detalles accion obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getSelect(req, res, next) {
    try {
      const data = await Services.getSelect();
      return res
        .status(200)
        .json({ ok: true, message: 'Detalles obtenidos correctamente', data });
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
      const dataCreated = await Services.create(payload);
      return res.status(200).json({
        ok: true,
        message: 'Accion creada correctamente',
        dataCreated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const dataUpdated = await Services.update(id, payload);
      return res.status(200).json({
        ok: true,
        message: 'Detalle accion actuzalizada correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      await Services.cambiarEstado(id);
      return res.status(200).json({
        ok: true,
        message: 'Se cambio su estado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
