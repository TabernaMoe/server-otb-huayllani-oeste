import { col, Op } from 'sequelize';
import { detalleAccionModel } from '../../../../models/accion/detalleAccion.model.js';
import { tipoAccionModel } from '../../../../models/accion/tipoAccion.model.js';

export class DetalleAccionRepository {
  static async getAll() {
    const data = await detalleAccionModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'tipo_accion_id'],
        include: [[col('tipoAccion.nombre_tipo_accion'), 'nombre_tipo_accion']],
      },
      include: [
        {
          model: tipoAccionModel,
          as: 'tipoAccion',
          attributes: [],
        },
      ],
      where: {
        tipo_servicio: 'AGUA',
      },
    });
    return data;
  }
  static async getById({ id, transaction = null }) {
    const data = await detalleAccionModel.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getByArrayIds({ detallesAccion = [], transaction = null }) {
    const data = await detalleAccionModel.findAll({
      where: {
        id: {
          [Op.in]: detallesAccion,
        },
      },
      transaction,
      raw: true,
    });
    if (data.length != detallesAccion.length) {
      return null;
    }
    return data;
  }
  static async getByName({
    nombre_accion,
    tipo_accion_id,
    transaction = null,
  }) {
    const data = await detalleAccionModel.findOne({
      where: {
        nombre_accion,
        tipo_accion_id,
        tipo_servicio: 'AGUA',
      },
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload, transaction = null }) {
    const data = await detalleAccionModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await detalleAccionModel.findByPk(id, { transaction });
    if (!data) {
      return data;
    }
    await data.update(payload, { transaction });
    return data;
  }
  static async chageStatus({ id, transaction = null }) {
    const data = await detalleAccionModel.findByPk(id, { transaction });
    if (!data) {
      return data;
    }
    await data.update({ estado: !data.estado }, { transaction });
    return data;
  }
  static async getSelectBytipo({ id, transaction = null }) {
    const data = await detalleAccionModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_accion', 'label'],
        'precio_accion',
        'tipo_cobro',
      ],
      where: {
        tipo_accion_id: id,
        tipo_servicio: 'AGUA',
      },
      transaction,
      raw: true,
    });
    return data;
  }
}
