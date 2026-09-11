import { col, fn } from 'sequelize';
import { personaAdminModel } from '../../models/auth/personaAdmin.js';
import { rolModel } from '../../models/auth/rol.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';

export class PersonaAdminRepository {
  static async getAll(page = 1, limit = 10, search = '', estado = undefined) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const valoresPermitidos = [true, false];

    if (estado !== undefined && !valoresPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );

      error.status = 400;
      throw error;
    }

    const where = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        {
          nombre_calle: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await personaAdminModel.findAndCountAll({
      attributes: [
        'id',
        [
          fn('CONCAT_WS', ' ', col('cedula_identidad'), col('ci_expedido')),
          'cedula_indentidad',
        ],
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('nombre'),
            col('apellido_paterno'),
            col('apellido_materno'),
          ),
          'nombre_completo',
        ],
        'cargo',
        [col('usuarioAdmin.rol.nombre_rol'), 'nombre_rol'],
        [col('usuarioAdmin.estado'), 'estado_usuario'],
      ],
      include: [
        {
          model: usuarioModel,
          as: 'usuarioAdmin',
          attributes: [],
          include: [{ model: rolModel, as: 'rol' }],
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
  static async getById({ id, transaction = null }) {
    const data = await personaAdminModel.findByPk(id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'usuario_id', 'id'],
        include: [[col('usuarioAdmin.rol.id'), 'rol_id']],
      },
      include: [
        {
          model: usuarioModel,
          as: 'usuarioAdmin',
          attributes: [],
          include: [{ model: rolModel, as: 'rol' }],
        },
      ],
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getByCi({ cedula_identidad, transaction = null }) {
    const data = await personaAdminModel.findOne({
      where: {
        cedula_identidad,
      },
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload, transaction = null }) {
    const data = await personaAdminModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction }) {
    const data = await personaAdminModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async changeStatus() {}
}
