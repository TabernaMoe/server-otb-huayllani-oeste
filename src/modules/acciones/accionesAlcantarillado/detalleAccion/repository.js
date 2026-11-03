import { col, Op } from 'sequelize';
import { detalleAccionModel } from '../../../../models/accion/detalleAccion.model.js';

export class DetalleAccionRepository {
  static async getAll() {
    const data = await detalleAccionModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'tipo_accion_id'],
      },
      where: {
        tipo_servicio: 'ALCANTARILLADO',
      },
    });
    return data;
  }
  static async getById({ id, transaction = null }) {
    const data = await detalleAccionModel.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'tipo_accion_id'] },
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
  static async getByName({ nombre_accion, transaction = null }) {
    const data = await detalleAccionModel.findOne({
      where: {
        nombre_accion,
        tipo_servicio: 'ALCANTARILLADO',
      },
      transaction,
    });
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload, transaction = null }) {
    const data = await detalleAccionModel.create(
      { ...payload, tipo_servicio: 'ALCANTARILLADO' },
      { transaction },
    );
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
  static async getSelect({ transaction = null } = {}) {
    const data = await detalleAccionModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_accion', 'label'],
        'precio_accion',
        'tipo_cobro',
      ],
      where: {
        tipo_servicio: 'ALCANTARILLADO',
      },
      transaction,
    });
    return data;
  }
}
