import { tipoAccionModel } from '../../../../models/accion/tipoAccion.model.js';

export class TipoAccionRepository {
  static async getAll() {
    const data = await tipoAccionModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return data;
  }
  static async getById({ id, transaction = null }) {
    const data = await tipoAccionModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    return data;
  }
  static async create({ payload, transaction = null }) {
    const data = await tipoAccionModel.create(payload, { transaction });
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await tipoAccionModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });

    return data;
  }
  static async getSelect() {
    const data = await tipoAccionModel.findAll({
      attributes: [
        ['id', 'value'],
        ['nombre_tipo_accion', 'label'],
      ],
      raw: true,
    });

    return data;
  }
}
