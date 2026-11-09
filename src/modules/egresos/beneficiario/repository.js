import { BeneficiarioEgresosModel } from '../../../models/egresos/beneficiario.model.js';
import { Op } from 'sequelize';

export class BeneficiarioRepository {
  static async getAllByName({ search, transaction = null }) {
    const nombre = search?.trim() || '';

    const data = await BeneficiarioEgresosModel.findAll({
      attributes: [
        ['nombre_beneficiario', 'value'],
        ['nombre_beneficiario', 'label'],
      ],
      where: nombre
        ? {
            nombre_beneficiario: {
              [Op.like]: `%${nombre}%`,
            },
          }
        : {},
      limit: 10,
      order: [['id', 'DESC']],
      transaction,
      raw: true,
    });
    return data;
  }
  static async getByName({ nombre_beneficiario, transaction = null }) {
    const data = await BeneficiarioEgresosModel.findOne({
      where: {
        nombre_beneficiario,
      },
      transaction,
      raw: true,
    });
    return !data ? null : data;
  }
  static async create({ payload, transaction = null }) {
    const data = BeneficiarioEgresosModel.create(payload, { transaction });
    return data;
  }
}
