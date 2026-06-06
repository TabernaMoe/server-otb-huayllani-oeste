import { periodoServices as services } from '../services/periodo.services.js';

export class peridoController {
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
        message: 'Periodos obtenidas correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async closePeriodo(req, res, next) {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      await services.closePeriodo(idNumber);
      return res
        .status(200)
        .json({ ok: true, message: 'Periodo cerrado correctamente' });
    } catch (e) {
      next(e);
    }
  }
}
