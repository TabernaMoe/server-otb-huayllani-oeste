import { col, Op } from 'sequelize';
import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { SocioRepository } from '../../socios/socio.repository.js';
import { AccionRepository } from '../../acciones/accion/repository.js';
import { periodoModel } from '../../../models/gestiones/periodo.model.js';

export class CobroRepository {
  static async getCobrosBySocio({ socio_id, tipo_cobro, transaction = null }) {
    const buscarSocio = await SocioRepository.getById({ id: socio_id });
    if (!buscarSocio) {
      const err = new Error('No se encontro el socio');
      err.statusCode = 404;
      throw err;
    }
    const data = await cobroModel.findAll({
      attributes: [
        'id',
        [col('periodo.mes'), 'mes'],
        'concepto',
        'descripcion',
        'saldo',
        'estado',
        'fecha_emision',
        'tipo_cobro',
      ],
      where: {
        socio_id,
        estado: {
          [Op.notIn]: ['PAGADO', 'ANULADO'],
        },
        ...(tipo_cobro && tipo_cobro != 'TODOS' && { tipo_cobro }),
      },
      include: [
        {
          model: periodoModel,
          as: 'periodo',
        },
      ],
      transaction,
    });
    return data;
  }
  static async getCobroByAccion({ accion_id, tipo_cobro, transaction = null }) {
    const buscarAccion = await AccionRepository.getById({ id: accion_id });
    if (!buscarAccion) {
      const err = new Error('No se encontro la acion');
      err.statusCode = 404;
      throw err;
    }
    const data = await cobroModel.findAll({
      attributes: [
        'id',
        [col('periodo.mes'), 'mes'],
        'concepto',
        'descripcion',
        'saldo',
        'estado',
        'fecha_emision',
        'tipo_cobro',
      ],
      where: {
        accion_id,
        estado: {
          [Op.notIn]: ['PAGADO', 'ANULADO'],
        },
        ...(tipo_cobro && tipo_cobro != 'TODOS' && { tipo_cobro }),
      },
      include: [
        {
          model: periodoModel,
          as: 'periodo',
        },
      ],
      transaction,
    });
    return data;
  }
  static async getCobrosByIdsByEstado({
    cobros = [],
    estado = [],
    transaction = null,
  }) {
    if (cobros.length == 0 && estado.length == 0) {
      return null;
    }
    const data = await cobroModel.findAll({
      where: {
        id: {
          [Op.in]: cobros,
        },
        estado,
      },
      transaction,
      raw: true,
    });

    if (data.length != cobros.length) {
      return null;
    }
    return data;
  }
  static async update({ id, payload, transaction = null }) {
    const data = await cobroModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    await data.update(payload, { transaction });
    return !data ? null : data;
  }
  static async create({ payload, transaction = null }) {
    const data = await cobroModel.create(payload, { transaction });
    return data;
  }
  static async createByArray({ payload = [], transaction = null }) {
    const data = await cobroModel.bulkCreate(payload, { transaction });
    return data;
  }
  static async deleteByArray({ payload, transaction = null }) {
    if (!Array.isArray(payload) || payload.length === 0) return null;

    const eliminados = await cobroModel.destroy({
      where: {
        id: {
          [Op.in]: payload,
        },
        estado: 'PENDIENTE',
      },
      //returning: true, devolver registro eliminados
      transaction,
    });

    return eliminados;
  }
}
