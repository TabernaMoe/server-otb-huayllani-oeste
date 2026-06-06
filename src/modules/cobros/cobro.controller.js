import { CobroServices as services } from './cobro.services.js';

export class CobroController {
  static async getAll(req, res, next) {
    try {
      const data = await services.getAll();
      return res
        .status(200)
        .json({ ok: true, message: 'Cobros obtenidos correctamente', data });
    } catch (e) {
      next(e);
    }
  }
}
