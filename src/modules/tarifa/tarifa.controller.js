import { TarifaServices as services } from './tarifa.services.js';

export class TaricaController {
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
        message: 'Tarifas obtenidas correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getAllSelect(req, res, next) {
    try {
      let search = req.query.search;

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await services.getAllSelect(search);

      return res.status(200).json({
        ok: true,
        message: 'Tarifas obtenidas correctamente para el select',
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
      const dato = await services.getId(idNumber);
      return res
        .status(200)
        .json({ ok: true, message: 'Tarifa obtenida correctamente', dato });
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
        message: 'Tarifa creada correctamente',
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

      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un número entero');
        throw err;
      }
      const dataUpdated = await services.update(idNumber, payload);
      return res.status(200).json({
        ok: true,
        message: 'Tarifa actuzalizada correctamente',
        dataUpdated,
      });
    } catch (e) {
      next(e);
    }
  }
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const idNumber = Number(id);

      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un número entero');
        throw err;
      }

      await services.delete(idNumber);
      return res.status(200).json({
        ok: true,
        message: 'Tarifa eliminada correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
  static async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un número entero');
        throw err;
      }
      await services.toggleStatus(idNumber);
      return res.status(200).json({
        ok: true,
        message: 'Se cambio su estado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
