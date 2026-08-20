import { Op, Sequelize } from 'sequelize';
import { gestionModel } from '../../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../../models/gestiones/periodo.model.js';
import { sequelize } from '../../../config/database.js';
import { fechaFormateada } from '../../../helpers/helpers.js';

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
      attributes: { exclude: ['createdAt', 'updatedAt', 'gestion_id'] },
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
      distinct: true,
    });

    const rowNor = rows.map((row) => ({
      ...row.toJSON(),
      fecha_inicio: fechaFormateada(row.fecha_inicio),
      fecha_fin: fechaFormateada(row.fecha_fin),
      fecha_cierre: fechaFormateada(row.fecha_cierre),
    }));

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rowNor,
    };
  }
  static async getAllSelect() {
    const data = await periodoModel.findAll({
      attributes: ['id', 'mes'],
      order: [['numero_mes', 'ASC']],
    });

    const dataNorm = data.map((row) => ({
      value: row.id,
      label: row.mes,
    }));
    return dataNorm;
  }
  static async closePeriodo(id) {
    const closeData = await sequelize.transaction(async (t) => {
      const gestionActiva = await gestionModel.findOne({
        where: {
          estado: 'ACTIVO',
        },
        transaction: t,
      });
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

      const periodoParaBloquear = await periodoModel.findOne({
        where: {
          estado: 'CERRADO',
        },
      });

      if (periodoParaBloquear) {
        await periodoParaBloquear.update(
          { estado: 'BLOQUEADO' },
          { transaction: t },
        );
      }

      const nextPeriodo = await periodoModel.findOne({
        where: {
          numero_mes: periodoSearch.numero_mes + 1,
          gestion_id: gestionActiva.id,
        },
        transaction: t,
      });
      if (!nextPeriodo) {
        return;
      } else {
        await nextPeriodo.update({ estado: 'ACTIVO' }, { transaction: t });
        return;
      }
    });
    return;
  }
}
