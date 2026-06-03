import { Op } from 'sequelize';
import { gestionModel } from '../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';
import { sequelize } from '../../config/database.js';

export class GestionService {
  static async getAll(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        sequelize.where(sequelize.cast(sequelize.col('anio'), 'varchar'), {
          [Op.iLike]: `%${search}%`,
        }),
      ];
    }

    const { count, rows } = await gestionModel.findAndCountAll({
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
  static async getId(id) {
    const dataId = await gestionModel.findByPk(id, {
      include: [{ model: periodoModel, as: 'periodos' }],
    });

    return dataId.toJSON();
  }
  static async create(payload) {
    const meses = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE',
    ];

    const { anio } = payload;

    const created = await sequelize.transaction(async (t) => {
      const gestionExistente = await gestionModel.findOne({
        where: { anio },
        transaction: t,
      });

      if (gestionExistente) {
        const err = new Error(`Ya existe una gestión para el año ${anio}.`);
        err.statusCode = 409;
        throw err;
      }

      const gestionActiva = await gestionModel.findOne({
        where: { estado: 'ACTIVO' },
        transaction: t,
      });

      if (gestionActiva) {
        if (gestionActiva.anio + 1 !== anio) {
          const err = new Error(
            `El año de la nueva gestión debe ser consecutivo al año activo actual (${gestionActiva.anio} → ${anio}). No se pueden saltar años.`,
          );
          err.statusCode = 400;
          throw err;
        }

        await gestionActiva.update({ estado: 'CERRADO' }, { transaction: t });
      }

      const gestionCreated = await gestionModel.create(
        {
          anio,
          estado: 'ACTIVO',
          fecha_inicio: new Date(anio, 0, 1),
          fecha_fin: new Date(anio, 11, 31),
        },
        { transaction: t },
      );

      const periodosData = meses.map((mes, index) => ({
        gestion_id: gestionCreated.id,
        numero_mes: index + 1,
        mes,
        fecha_inicio: new Date(anio, index, 1),
        fecha_fin: new Date(anio, index + 1, 0),
      }));

      await periodoModel.bulkCreate(periodosData, {
        transaction: t,
      });

      return gestionModel.findByPk(gestionCreated.id, {
        include: [{ model: periodoModel, as: 'periodos' }],
        transaction: t,
      });
    });

    return created;
  }
  static async delete(id) {
    return await sequelize.transaction(async (t) => {
      const gestion = await gestionModel.findByPk(id, {
        transaction: t,
      });

      if (!gestion) {
        const err = new Error('No existe la gestión.');
        err.statusCode = 404;
        throw err;
      }

      if (gestion.estado !== 'ACTIVO') {
        const err = new Error(
          'Solo se puede eliminar la gestión activa actual.',
        );
        err.statusCode = 400;
        throw err;
      }

      const gestionAnterior = await gestionModel.findOne({
        where: {
          anio: gestion.anio - 1,
        },
        transaction: t,
      });

      if (!gestionAnterior) {
        const err = new Error(
          'No se puede eliminar la primera gestión creada.',
        );
        err.statusCode = 400;
        throw err;
      }

      const periodos = await periodoModel.findAll({
        where: { gestion_id: id },
        attributes: ['id'],
        transaction: t,
      });

      const periodoIds = periodos.map((p) => p.id);

      // Aquí validas si hay datos relacionados reales.
      // Ejemplo:
      /*
    const cobros = await cobroModel.count({
      where: {
        periodo_id: periodoIds,
      },
      transaction: t,
    });

    if (cobros > 0) {
      const err = new Error(
        'No se puede eliminar la gestión porque tiene cobros registrados.'
      );
      err.statusCode = 409;
      throw err;
    }
    */

      await periodoModel.destroy({
        where: { gestion_id: id },
        transaction: t,
      });

      await gestion.destroy({
        transaction: t,
      });

      await gestionAnterior.update({ estado: 'ACTIVO' }, { transaction: t });

      return {
        message: 'Gestión eliminada correctamente.',
      };
    });
  }
}
