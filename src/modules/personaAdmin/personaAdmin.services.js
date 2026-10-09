import { PersonaAdminRepository } from './personaAdmin.repository.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { rolModel } from '../../models/auth/rol.model.js';
import { sequelize } from '../../config/database.js';
import bcrypt from 'bcrypt';

export class PersonaAdminServices {
  static async getAll({ queryPage, queryLimit, querySearch, queryEstado }) {
    const page = Number(queryPage) || 1;
    const limit = Number(queryLimit) || 10;

    let search = querySearch;
    let estado = queryEstado;

    search =
      search && search !== 'undefined' && search !== 'null'
        ? search.trim()
        : '';

    if (estado === 'true') {
      estado = true;
    } else if (estado === 'false') {
      estado = false;
    } else {
      estado = undefined;
    }

    const data = await PersonaAdminRepository.getAll(
      page,
      limit,
      search,
      estado,
    );
    return data;
  }
  static async getId(id) {
    const data = await PersonaAdminRepository.getById({ id });
    if (!data) {
      const err = new Error('No se encontro el usuario');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async create(payload) {
    const { cedula_identidad, rol_id, contrasenia, ...parent } = payload;

    return sequelize.transaction(async (t) => {
      const dobleCi = await PersonaAdminRepository.getByCi({
        cedula_identidad,
        transaction: t,
      });
      if (dobleCi) {
        const err = new Error(
          'Ya existe un usuario con esa cedula de identidad',
        );
        err.statusCode = 409;
        throw err;
      }
      const bucarRol = await rolModel.findByPk(rol_id, { transaction: t });
      if (!bucarRol) {
        const err = new Error('No se encontro el rol');
        err.statusCode = 404;
        throw err;
      }
      const hashedPassword = await bcrypt.hash(contrasenia, 12);
      const crearUsuario = await usuarioModel.create(
        {
          nombre_usuario: cedula_identidad,
          contrasenia_usuario: hashedPassword,
          rol_id: rol_id,
        },
        {
          transaction: t,
        },
      );

      const crearPersona = await PersonaAdminRepository.create({
        payload: {
          usuario_id: crearUsuario.id,
          cedula_identidad,
          ...parent,
        },
        transaction: t,
      });
      return crearPersona;
    });
  }
  static async update({ id, payload }) {
    const { cedula_identidad, rol_id, contrasenia, ...parent } = payload;

    if (Object.keys(payload).length === 0) {
      const err = new Error('Debe enviar un valor al menos para actualizar');
      err.statusCode = 404;
      throw err;
    }
    return sequelize.transaction(async (t) => {
      let dataUsuario = {};
      let data = {};
      if (cedula_identidad) {
        const dobleCi = await PersonaAdminRepository.getByCi({
          cedula_identidad,
          transaction: t,
        });
        if (dobleCi) {
          const err = new Error(
            'Ya existe un usuario con esa cedula de identidad',
          );
          err.statusCode = 409;
          throw err;
        }
        data.cedula_identidad = cedula_identidad;
        dataUsuario.nombre_usuario = cedula_identidad;
      }
      if (rol_id) {
        const bucarRol = await rolModel.findByPk(rol_id, { transaction: t });
        if (!bucarRol) {
          const err = new Error('No se encontro el rol');
          err.statusCode = 404;
          throw err;
        }
        dataUsuario.rol_id = rol_id;
      }
      if (contrasenia) {
        const hashedPassword = await bcrypt.hash(contrasenia, 12);
        dataUsuario.contrasenia_usuario = hashedPassword;
      }

      let actualizarPersona = null;
      let actualizarUsuario = null;

      if (Object.keys(data).length > 0) {
        actualizarPersona = await PersonaAdminRepository.update({
          id,
          payload: { cedula_identidad, ...parent },
          transaction: t,
        });
        if (!actualizarPersona) {
          const err = new Error('No se encontro al usuario');
          err.statusCode = 404;
          throw err;
        }
      }
      if (Object.keys(dataUsuario).length > 0) {
        actualizarUsuario = await usuarioModel.findByPk(
          actualizarPersona.usuario_id,
          { transaction: t },
        );
        if (!actualizarUsuario) {
          const err = new Error('No se encontro al usuario');
          err.statusCode = 404;
          throw err;
        }
        await actualizarUsuario.update(dataUsuario, { transaction: t });
      }
      return actualizarPersona;
    });
  }
  static async changeStatus(id) {
    const data = await PersonaAdminRepository.getById(id);
    if (!data) {
      const err = new Error('No se encontro el usuario');
      err.statusCode = 404;
      throw err;
    }
    const estadoUsuario = await usuarioModel.findByPk(data.usuario_id);
    if (!estadoUsuario) {
      const err = new Error('No se encontro el usuario');
      err.statusCode = 404;
      throw err;
    }
    await estadoUsuario.update({ estado: !estadoUsuario.estado });
    return;
  }
}
