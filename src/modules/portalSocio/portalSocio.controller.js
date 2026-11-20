import { PortalSocioServices as services } from './portalSocio.services.js';

export class PortalSocioController {
  static async perfil(req, res) {
    const data = await services.getPerfil(req.usuario.socio_id);
    return res.status(200).json({ ok: true, data });
  }

  static async actualizarPerfil(req, res) {
    const data = await services.updatePerfil(
      req.usuario.socio_id,
      req.validated.body,
    );
    return res.status(200).json({
      ok: true,
      message: 'Perfil actualizado correctamente',
      data,
    });
  }

  static async resumen(req, res) {
    const data = await services.getResumen(req.usuario.socio_id);
    return res.status(200).json({ ok: true, data });
  }

  static async acciones(req, res) {
    const data = await services.getAcciones(req.usuario.socio_id);
    return res.status(200).json({ ok: true, data });
  }

  static async lecturas(req, res) {
    const accionId = req.validated?.query?.accion_id ?? null;
    const data = await services.getLecturas(req.usuario.socio_id, accionId);
    return res.status(200).json({ ok: true, data });
  }

  static async cobros(req, res) {
    const accionId = req.validated?.query?.accion_id ?? null;
    const data = await services.getCobros(req.usuario.socio_id, accionId);
    return res.status(200).json({ ok: true, data });
  }

  static async recibos(req, res) {
    const accionId = req.validated?.query?.accion_id ?? null;
    const data = await services.getRecibos(req.usuario.socio_id, accionId);
    return res.status(200).json({ ok: true, data });
  }

  static async cambiarPassword(req, res) {
    await services.cambiarPassword(req.usuario.user_id, req.validated.body);
    return res.status(200).json({
      ok: true,
      message: 'Contraseña actualizada correctamente',
    });
  }
}
