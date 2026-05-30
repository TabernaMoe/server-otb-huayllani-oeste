import { col, Op } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { accionModel } from '../../../models/acciones/accion.model.js';
import { calleRamalModel } from '../../../models/acciones/calleRamal.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { tipoAccionAccionModel } from '../../../models/acciones/tipoAccionAccion.model.js';
import { tipoAccionModel } from '../../../models/acciones/tipoAccion.model.js';

export class accionServices {
  static async getAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [{ nombre_calle: { [Op.iLike]: `%${search}%` } }];
    }

    const { count, rows } = await accionModel.findAndCountAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      where,
      limit,
      offset,
      include: [
        {
          model: socioModel,
          as: 'accion_socio',
          attributes: [
            'ci_socio',
            'primer_apellido_socio',
            'segundo_apellido_socio',
          ], // ✅ Así se seleccionan
          required: false, // LEFT JOIN
        },
        {
          model: calleRamalModel,
          as: 'accion_calle',
          required: false,
        },
        {
          model: tipoAccionModel,
          as: 'accionesTipos',
          attributes: ['id', 'nombre_tipos_acciones'],
          through: { attributes: [] },
          required: false,
        },
      ],
      order: [['id', 'DESC']],
      distinct: true,
    });

    const dataPlana = rows.map((row) => ({
      ...row.toJSON(),
      ci_socio: row.accion_socio?.ci_socio,
      primer_apellido_socio: row.accion_socio?.primer_apellido_socio,
      segundo_apellido_socio: row.accion_socio?.segundo_apellido_socio,
      nombre_calle: row.accion_calle?.nombre_calle,
    }));

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: dataPlana,
    };
  }
  static async getId(id) {
    const dataId = await accionModel.findByPk(id, {
      attributes: {
        include: [
          [col('accion_socio.id'), 'socio_id'],
          [col('accion_calle.id'), 'calle_id'],
        ],
      },
      include: [
        {
          model: socioModel,
          as: 'accion_socio',
          attributes: [],
        },
        {
          model: calleRamalModel,
          as: 'accion_calle',
          attributes: [],
        },
        {
          model: tipoAccionModel,
          as: 'acciones',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }
  static async create(payload) {
    const created = await sequelize.transaction(async (t) => {
      const { calle_id, socio_id, acciones, ...parent } = payload;
      console.log('************+');
      console.log(payload);

      const socioSearch = await socioModel.findByPk(socio_id, {
        raw: true,
        transaction: t,
      });
      if (!socioSearch) {
        const err = new Error('Socio no encontrado');
        err.statusCode = 403;
        throw err;
      }
      const calleSerch = await calleRamalModel.findByPk(calle_id, {
        raw: true,
        transaction: t,
      });
      if (!calleSerch) {
        const err = new Error('Calle no encontrada');
        err.statusCode = 403;
        throw err;
      }

      if (!Array.isArray(acciones) || acciones.length === 0) {
        const err = new Error('Debe seleccionar al menos un tipo de acción');
        err.statusCode = 400;
        throw err;
      }

      const totalAcciones = await tipoAccionModel.count({
        where: {
          id: {
            [Op.in]: acciones,
          },
        },
        transaction: t,
      });
      if (totalAcciones !== acciones.length) {
        throw new Error('Uno o más tipos no existen');
      }

      const dataCreated = await accionModel.create(
        {
          socio_id: socioSearch.id,
          calle_id: calleSerch.id,
          ...parent,
        },
        {
          transaction: t,
        },
      );

      await dataCreated.setAccionesTipos(acciones, { transaction: t });

      const dataSearch = await accionModel.findByPk(dataCreated.id, {
        include: [
          {
            model: socioModel,
            as: 'accion_socio',
            attributes: ['nombres_socio'],
          },
          {
            model: calleRamalModel,
            as: 'accion_calle',
            attributes: ['nombre_calle'],
          },
          {
            model: tipoAccionModel,
            as: 'accionesTipos',
            attributes: ['nombre_tipos_acciones', 'costo_tipos_acciones'],
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });

      const montoTotalAcciones = dataSearch.accionesTipos.reduce(
        (acumulador, tipoAccion) =>
          acumulador + Number(tipoAccion.costo_tipos_acciones),
        0,
      );

      const cobroAccion = await cobroModel.create(
        {
          socio_id: socioSearch.id,
          tipo_cobro: 'ACCION',
          referencia_id: dataCreated.id,
          concepto_cobro: 'Pago Accion',
          descripcion: 'Cobro generado automáticamente por creación de acción',
          monto_total_cobro: montoTotalAcciones,
          monto_pagado_cobro: 0,
          saldo_cobro: montoTotalAcciones,
        },
        { transaction: t },
      );

      return { dataSearch, cobroAccion };
    });
    return created;
  }
  static async update(id, payload) {
    const updated = await sequelize.transaction(async (t) => {
      const { calle_id, acciones, ...parent } = payload;

      const accion = await accionModel.findByPk(id, {
        transaction: t,
      });
      if (!accion) {
        const err = new Error('Acción no encontrada');
        err.statusCode = 404;
        throw err;
      }
      // Solo valida calle si viene en el payload
      if (calle_id !== undefined) {
        const calleSearch = await calleRamalModel.findByPk(calle_id, {
          raw: true,
          transaction: t,
        });

        if (!calleSearch) {
          const err = new Error('Calle no encontrada');
          err.statusCode = 404;
          throw err;
        }

        parent.calle_id = calleSearch.id;
      }

      // Solo actualiza campos normales si vienen
      await accion.update(parent, {
        transaction: t,
      });

      // Solo actualiza la relación muchos a muchos si acciones viene en el payload
      if (acciones !== undefined) {
        if (!Array.isArray(acciones)) {
          const err = new Error('Acciones debe ser un array de IDs');
          err.statusCode = 400;
          throw err;
        }

        const totalAcciones = await tipoAccionModel.count({
          where: {
            id: {
              [Op.in]: acciones,
            },
          },
          transaction: t,
        });

        if (totalAcciones !== acciones.length) {
          const err = new Error('Uno o más tipos de acción no existen');
          err.statusCode = 400;
          throw err;
        }

        await accion.setAccionesTipos(acciones, {
          transaction: t,
        });
      }

      const dataSearch = await accionModel.findByPk(id, {
        include: [
          {
            model: socioModel,
            as: 'accion_socio',
            attributes: ['nombres_socio'],
          },
          {
            model: calleRamalModel,
            as: 'accion_calle',
            attributes: ['nombre_calle'],
          },
          {
            model: tipoAccionModel,
            as: 'accionesTipos',
            attributes: ['nombre_tipos_acciones', 'costo_tipos_acciones'],
            through: {
              attributes: [],
            },
          },
        ],
        transaction: t,
      });

      return dataSearch;
    });
    return updated;
  }
  static async disable(id) {
    const accion = await accionModel.findByPk(id);
    if (!accion) {
      const err = new Error('No existe la accion');
      err.statusCode = 403;
      throw err;
    }
    await accion.update({ estado_accion: 'ANULADO' });
    return {
      message: 'Acción desactivada correctamente',
    };
  }
}
