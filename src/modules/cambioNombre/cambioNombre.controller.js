import CambioNombreService from './cambioNombre.services.js';

class CambioNombreController {
  static async getAll(req, res, next) {
    try {
      const result = await CambioNombreService.getAll({
        queryEstado: req.query.estado,
        queryLimit: req.query.limit,
        queryPage: req.query.page,
        querySearch: req.query.search,
      });

      return res.status(200).json({
        ok: true,
        message: 'Se obtuvo correctamente los cambios de nombre',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getId(req, res, next) {
    try {
      const data = await CambioNombreController.getId(req.params.id);
      return res.status(200).json({
        ok: true,
        message: 'Se obtuvo el cambio de nombre correctamente',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
  static async create(req, res, next) {
    const data = await CambioNombreService.create(req.body);
    return res.status(200).json({
      ok: true,
      message: 'Se hizo correctamente el cambio de nombre',
      data,
    });
  }
}

export default CambioNombreController;
