import { Services as services } from './services.js';
export class AcccionAlcantarilladoController {
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
  static async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;

      let idNumber = Number(id);
      if (isNaN(idNumber) && !Number.isInteger(idNumber)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }
      await services.cambiarEstado(idNumber);
      return res.status(200).json({
        ok: true,
        message: 'Se cambio el estado correctamente',
      });
    } catch (e) {
      next(e);
    }
  }
}
