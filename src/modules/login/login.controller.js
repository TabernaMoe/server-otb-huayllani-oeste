import { LoginServices as services } from './login.services.js';

export class LoginController {
  static async InicarSesion(req, res, next) {
    try {
      const { nombre_usuario, contrasenia_usuario } = req.body;
      const data = await services.iniciarSesion(
        nombre_usuario,
        contrasenia_usuario,
      );

      return res.status(200).json({
        ok: true,
        message: 'Inicio de sesión correcto',
        ...data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      return res.status(200).json({
        ok: true,
        message: 'Usuario obtenido exitosamente',
        data: req.usuario,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req, res, next) {
    try {
      await services.updateMe(req.usuario.user_id, req.body);

      return res.status(200).json({
        ok: true,
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
