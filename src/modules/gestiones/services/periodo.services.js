import { Op, Sequelize } from 'sequelize';
import { gestionModel } from '../../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../../models/gestiones/periodo.model.js';
import { sequelize } from '../../../config/database.js';

export class periodoServices {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const gestionActiva = await gestionModel.findOne({
      where: {
        estado: 'ACTIVO',
      },
    });

    if (!gestionActiva) {
      const err = new Error('No hay una gestio activa');
      throw err;
    }
    const where = {
      gestion_id: gestionActiva.id,
    };

    if (search) {
      where.mes = { [Op.iLike]: `%${search}%` };
    }
    const { count, rows } = await periodoModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
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
  static async closePeriodo(id) {
    const closeData = await sequelize.transaction(async (t) => {
      const periodoSearch = await periodoModel.findByPk(id, { transaction: t });
      if (!periodoSearch) {
        const err = new Error('No se encontro el periodo');
        err.statusCode = 404;
        throw err;
      }

      if (periodoSearch.estado !== 'ACTIVO') {
        const err = new Error('Este mes no esta activo para cerrarlo');
        throw err;
      }

      await periodoSearch.update({ estado: 'CERRADO' }, { transaction: t });

      const nextPeriodo = await periodoModel.findOne({
        numero_mes: periodoSearch.numero_mes + 1,
        transaction: t,
      });
      await nextPeriodo.update({ estado: 'ACTIVO' }, { transaction: t });
      return;
    });
    return;
  }
}
