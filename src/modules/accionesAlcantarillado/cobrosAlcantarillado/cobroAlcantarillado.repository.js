import { col, Op } from 'sequelize';
import { cobroAlcantarilladoModel } from '../../../models/accionAlcantarillado/cobroAlcantarillado/cobroAlcantarillado.model.js';
import { accionAlcantarilladoModel } from '../../../models/accionAlcantarillado/acccionAlcantarillado.model.js';

export class CobroAlcantarilladoRepository {
  static async getById({ id, transaction = null }) {
    const data = await cobroAlcantarilladoModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    return data;
  }
  static async getByArrayIds({ ids = [], transaction = null }) {
    const data = await cobroAlcantarilladoModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
      raw: true,
    });

    if (data.length !== ids.length) {
      return null;
    }
    return data;
  }
  static async getPendinentesBySocio({ socio_id }) {
    const data = await cobroAlcantarilladoModel.findAll({
      attributes: {
        include: [
          [
            col('accionCobroAlcantarillado.codigo_interno'),
            'codigo_interno_accion',
          ],
        ],
        exclude: [
          'socio_id',
          'accion_id',
          'periodo_id',
          'createdAt',
          'updatedAt',
        ],
      },
      include: [
        {
          model: accionAlcantarilladoModel,
          as: 'accionCobroAlcantarillado',
          attributes: [],
        },
      ],
      where: {
        socio_id,
        estado: {
          [Op.in]: ['PENDIENTE', 'PARCIAL'],
        },
      },
      order: [['createdAt', 'DESC']],
    });

    return data;
  }
  static async getPendinentesByAccion({ accion_id }) {
    const data = await cobroAlcantarilladoModel.findAll({
      where: {
        accion_id,
        estado: {
          [Op.in]: ['PENDIENTE', 'PARCIAL'],
        },
      },
      order: [['createdAt', 'DESC']],
    });

    return data;
  }
  static async getHitorialBySocio({ socio_id, limit, page, search }) {
    const offset = (page - 1) * limit;

    let where = {
      socio_id,
    };

    if (search) {
      where[Op.or] = [
        { concepto: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await cobroAlcantarilladoModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getHitorialByAccion({ accion_id, limit, page, search }) {
    const offset = (page - 1) * limit;

    let where = { accion_id };

    if (search) {
      where[Op.or] = [
        {
          concepto: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          descripcion: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await cobroAlcantarilladoModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async getHitorial({ limit, page, search }) {
    const offset = (page - 1) * limit;

    let where = {};

    if (search) {
      where[Op.or] = [
        {
          concepto: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          descripcion: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await cobroAlcantarilladoModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
  static async create({ payload, transaction = null }) {
    const data = await cobroAlcantarilladoModel.create(payload, {
      transaction,
    });
    return data;
  }
  static async pagar({ id, monto_pagado, transaction = null }) {
    const data = await cobroAlcantarilladoModel.findByPk(id, { transaction });
    if (!data) {
      return null;
    }
    const saldo = data.saldo - monto_pagado;
    await data.update(
      {
        monto_pagado,
        saldo,
        estado: saldo > 0 ? 'PARCIAL' : 'PAGADO',
      },
      {
        transaction,
      },
    );
    return data;
  }
  static async pagarArray({ ids = [], transaction = null }) {
    const data = await cobroAlcantarilladoModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
      raw: true,
    });
    if (data.length != ids.length) {
      return null;
    }
    for (let pago of data) {
      await cobroAlcantarilladoModel.update(
        {
          monto_pagado: pago.monto_total,
          saldo: 0,
          estado: 'PAGADO',
        },
        {
          where: {
            id: pago.id,
          },
          transaction,
        },
      );
    }
    return await cobroAlcantarilladoModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
      raw: true,
    });
  }
}
