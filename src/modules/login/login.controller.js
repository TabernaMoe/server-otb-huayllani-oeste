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
}
