import { Op, Sequelize } from 'sequelize';
import { tipoAccionModel as model } from '../../../models/acciones/tipoAccion.model.js';
import { tipoAccionAccionModel } from '../../../models/acciones/tipoAccionAccion.model.js';

export class tipoAccionServices {
  static async getAll() {
    const data = await model.findAll();
    return data;
  }
  static async getId(id) {
    const dataId = await model.findByPk(id, { raw: true });
    if (!dataId) {
      const err = new Error('No se encontro la calle');
      err.statuCode = 403;
      throw err;
    }
    return dataId;
  }
  static async create(payload) {
    const dataCreated = await model.create(payload);
    return dataCreated;
  }
  static async update(id, payload) {
    const dataSearh = await model.findByPk(id);
    if (!dataSearh) {
      const err = new Error('No existe la calle');
      err.statusCode = 404;
      throw err;
    }
    await dataSearh.update(payload);
    return dataSearh;
  }
  static async delete(id) {
    const dataSearch = await model.findByPk(id);
    if (!dataSearch) {
      const err = new Error('No se encontro el tipo de accion');
      err.statuCode = 404;
      throw err;
    }
    const usado = await tipoAccionAccionModel.count({
      where: { tipo_accion_id: dataSearch.id },
    });

    if (usado > 0) {
      const err = new Error('Este tipo de acción está siendo usado');
      err.statusCode = 409; // Conflict o 403 Forbidden
      throw err;
    }

    await dataSearch.destroy();

    return;
  }
}
