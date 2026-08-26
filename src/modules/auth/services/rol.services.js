import { rolModel } from '../../../models/auth/rol.model.js';
import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { permisoModel } from '../../../models/auth/permiso.model.js';
import { usuarioModel } from '../../../models/auth/usuario.model.js';

export class RolServices {
  static async getAll() {
    const data = await rolModel.findAll();
    return data;
  }
  static async getAllPagination(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    let where = {
      nombre_rol: {
        [Op.notIn]: ['super_admin', 'usuario_normalGE'],
      },
    };

    if (search) {
      where.nombre_rol[Op.iLike] = `%${search}%`;
    }

    const { count, rows } = await rolModel.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: permisoModel,
          as: 'permisos',
          attributes: ['nombre_permiso'],
          through: {
            attributes: [],
          },
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getPermissos() {
    const dataPermiso = permisoModel.findAll();
    return dataPermiso;
  }
  static async getId(id) {
    const data = await rolModel.findByPk(id, {
      include: [
        {
          model: permisoModel,
          as: 'permisos',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!data) {
      const err = new Error('No se encontro el rol');
      err.statuCode = 404;
      throw err;
    }

    const permisos = data?.permisos;

    const permisosNorM = permisos?.map((row) => Number(row.id));
    return { ...data.toJSON(), permisos: permisosNorM };
  }
  static async create(payload) {
    const created = await sequelize.transaction(async (t) => {
      const { nombre_rol, permisos = [] } = payload;

      const rolSearch = await rolModel.findOne({
        where: {
          nombre_rol,
        },
        transaction: t,
      });
      if (rolSearch) {
        const err = new Error('Ya existe un rol con ese nombre');
        err.statuCode = 409;
        throw err;
      }

      const permisosExistentes = await permisoModel.findAll({
        where: {
          id: {
            [Op.in]: permisos,
          },
        },
        transaction: t,
      });

      if (permisosExistentes.length !== permisos.length) {
        const err = new Error('Uno o varios permisos no existen');

        err.statusCode = 404;
        throw err;
      }

      const permisosIds = [...new Set(permisos)];

      const rolCreated = await rolModel.create(
        { nombre_rol },
        { transaction: t },
      );
      await rolCreated.setPermisos(permisosIds, {
        transaction: t,
      });

      const rolReload = await rolModel.findByPk(rolCreated.id, {
        include: [
          {
            model: permisoModel,
            as: 'permisos',
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });
      return rolReload;
    });
    return created;
  }
  static async update(id, payload) {
    const updated = await sequelize.transaction(async (t) => {
      const { nombre_rol, permisos = [] } = payload;
      const rolSearch = await rolModel.findByPk(id, { transaction: t });
      if (!rolSearch) {
        const err = new Error('No existe el rol');
        err.statuCode = 404;
        throw err;
      }

      if (nombre_rol && nombre_rol !== rolSearch.nombre_rol) {
        const rolExistente = await rolModel.findOne({
          where: { nombre_rol },
          transaction: t,
        });

        if (rolExistente) {
          const err = new Error('Ya existe un rol con ese nombre');
          err.statusCode = 409;
          throw err;
        }

        await rolSearch.update({ nombre_rol }, { transaction: t });
      }

      // Actualizar permisos si es necesario
      if (permisos && permisos.length > 0) {
        const permisosIds = [...new Set(permisos)];
        const permisosExistentes = await permisoModel.findAll({
          where: {
            id: {
              [Op.in]: permisosIds,
            },
          },
          transaction: t,
        });

        if (permisosExistentes.length !== permisosIds.length) {
          const err = new Error('Uno o varios permisos no existen');

          err.statusCode = 404;
          throw err;
        }

        await rolSearch.setPermisos(permisosIds, { transaction: t });
      }

      const rolReload = await rolModel.findByPk(rolSearch.id, {
        include: [
          {
            model: permisoModel,
            as: 'permisos',
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });
      return rolReload;
    });
    return updated;
  }
}
