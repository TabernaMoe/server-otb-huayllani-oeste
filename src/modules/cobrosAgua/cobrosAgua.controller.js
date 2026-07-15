import { CobroAguaServices } from './cobrosAgua.services.js';

export class CobroAguaController {
  static async getAll(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let search = String(req.query.search);

      search =
        search && search !== 'undefined' && search !== 'null'
          ? search.trim()
          : '';

      const result = await CobroAguaServices.getAll(page, limit, search);

      return res.status(200).json({
        ok: true,
        message: 'Cobros agua obtenidos correctamente',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id) && !Number.isInteger(id)) {
        const err = new Error('El id debe ser un numero entero');
        throw err;
      }

      const data = await CobroAguaServices.getId(id);

      return res.status(200).json({
        ok: true,
        message: 'Cobro agua obtenidos correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async historial(req, res, next) {
    {
      try {
        const { id } = req.params;

        if (isNaN(id) && !Number.isInteger(id)) {
          const err = new Error('El id debe ser un numero entero');
          throw err;
        }

        const data = await CobroAguaServices.historial(id);

        return res.status(200).json({
          ok: true,
          message: 'Historial Cobro agua obtenidos correctamente',
          data,
        });
      } catch (e) {
        next(e);
      }
    }
  }
  static async pagarAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const pdfBytes = await CobroAguaServices.pagarAdmin(id, payload);

      // 3. Enviar el PDF como respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=recibo-Recibo.pdf`,
      );
      res.setHeader('Content-Length', pdfBytes.length);

      return res.send(pdfBytes);
    } catch (e) {
      next(e);
    }
  }
}
