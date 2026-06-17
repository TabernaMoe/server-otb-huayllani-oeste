import { LoginServices as services } from './login.services.js';

export class LoginController {
  static async InicarSesion(req, res, next) {
    try {
      const { nombre_usuario, contrasenia_usuario } = req.body;

      const data = await services.InicarSesion(
        nombre_usuario,
        contrasenia_usuario,
      );
      return res.status(200).json({ ok: true, ...data });
    } catch (e) {
      next(e);
    }
  }
  static async getMe(req, res, nex) {
    try {
      const data = req.usuario;

      if (!data) {
        const err = new Error('Datos no econtrados');
        throw data;
      }

      return res
        .status(200)
        .json({ ok: true, message: 'Usuario obtenido exitosamente', data });
    } catch (e) {
      next(e);
    }
  }
  static async updateMe(req, res, nex) {
    try {
      const { id, tipo_usuario } = req.usuario;
      const payload = req.body;

      await services.updateMe(id, tipo_usuario, payload);

      return res.status(200).json({
        ok: true,
        message: 'Contraseña actualizada correctamenete',
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}
