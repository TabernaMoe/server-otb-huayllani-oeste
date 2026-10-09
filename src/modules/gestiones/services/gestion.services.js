import { Op } from 'sequelize';
import { gestionModel } from '../../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../../models/gestiones/periodo.model.js';
import { sequelize } from '../../../config/database.js';

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
      attributes: ['id', 'anio', 'fecha_inicio', 'fecha_fin', 'estado'],
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
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: periodoModel,
          as: 'periodos',
          attributes: { exclude: ['createdAt', 'updatedAt', 'gestion_id', ''] },
        },
      ],
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
        const periodosActios = await periodoModel.findAll({
          where: {
            gestion_id: gestionActiva.id,
            estado: 'ACTIVO',
          },
          transaction: t,
        });

        if (periodosActios.length !== 0) {
          const err = new Error(
            'No se pude crear una nueva gestion si no estan cerradas todos lo periodos',
          );
          err.statusCode = 409;
          throw err;
        }
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

      const activarPeriodo = await periodoModel.findOne({
        where: {
          gestion_id: gestionCreated.id,
          numero_mes: 1,
        },
        transaction: t,
      });

      await activarPeriodo.update({ estado: 'ACTIVO' }, { transaction: t });

      return gestionModel.findByPk(gestionCreated.id, {
        include: [{ model: periodoModel, as: 'periodos' }],
        transaction: t,
      });
    });

    return created;
  }
}
