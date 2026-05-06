import { usuarioModel, usuarioRolModel } from '../model/usuario.model.js';
import { permisoModel } from '../model/permiso.model.js';
import { permisoRolModel, rolModel } from '../model/rol.model.js';
import { sequelize } from '../../../config/database.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../.././../helpers/token.helpers.js';

export class UserServices {
  static async IniciarSesion(nombre_usuario, contrasenia_usuario) {
    const userData = await usuarioModel.findOne({
      where: {
        nombre_usuario,
      },
    });

    if (!userData) {
      const err = new Error('Credenciales incorrectas');
      err.statusCode = 400;
      throw err;
    }
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      const err = new Error('Credenciales incorrectas');
      err.statusCode = 403;
      throw err;
    }
    const token = generateToken(usuario.id);

    return { ok: true, userData, token };
  }
  static async me(usuario) {}
}
