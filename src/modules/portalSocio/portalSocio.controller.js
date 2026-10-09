import { PortalSocioServices as services } from './portalSocio.services.js';

export class PortalSocioController {
  static async perfil(req, res, next) {
    try {
      const data = await services.getPerfil(req.usuario.socio_id);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async resumen(req, res, next) {
    try {
      const data = await services.getResumen(req.usuario.socio_id);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async acciones(req, res, next) {
    try {
      const data = await services.getAcciones(req.usuario.socio_id);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async lecturas(req, res, next) {
    try {
      const data = await services.getLecturas(req.usuario.socio_id);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async cobros(req, res, next) {
    try {
      const data = await services.getCobros(req.usuario.socio_id);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async recibos(req, res, next) {
    try {
      const data = await services.getRecibos(req.usuario.socio_id);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async cambiarPassword(req, res, next) {
    try {
      await services.cambiarPassword(req.usuario.user_id, req.body);
      return res.status(200).json({
        ok: true,
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
