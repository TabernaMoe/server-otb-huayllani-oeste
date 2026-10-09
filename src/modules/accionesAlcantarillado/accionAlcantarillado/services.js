import { accionAlcantarillado } from '../../../models/accionAlcantarillado/acccionAlcantarillado.model.js';
import {
  accionAlcantarilladoDetalle,
  detallePagoAccionAlcantarillado,
} from '../../../models/accionAlcantarillado/detallePagoAccionAlcantarillado.model.js';
import { sequelize } from '../../../config/database.js';
import { col, fn, literal, Op, Sequelize } from 'sequelize';
import { socioModel } from '../../../models/socio.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { ValidacionesSequelize as Validaciones } from '../../../validators/ValidacionesSequelize.js';
import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { cobroAccionAlcantarilladoModel } from '../../../models/cobros/tipoCobros/cobro_alcantarillado.js';

export class Services {
  static async getAll(page = 1, limit = 10, search = '', estado = undefined) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const valoresPermitidos = [true, false];

    if (estado !== undefined && !valoresPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${valoresPermitidos.join(', ')}`,
      );

      error.status = 400;
      throw error;
    }

    const where = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        Sequelize.where(
          Sequelize.cast(
            Sequelize.col('acciones_alcantarillado.codigo_interno'),
            'TEXT',
          ),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),
        {
          '$calleAlcantarillado.nombre_calle$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAlcantarillado.nombres$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAlcantarillado.primer_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAlcantarillado.segundo_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await accionAlcantarillado.findAndCountAll({
      attributes: {
        exclude: ['socio_id', 'calle_id', 'createdAt', 'updatedAt'],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col(`socioAlcantarillado.nombres`),
              col(`socioAlcantarillado.primer_apellido`),
              col(`socioAlcantarillado.segundo_apellido`),
            ),
            'nombre_completo',
          ],
          [col('calleAlcantarillado.nombre_calle'), 'nombre_calle'],
        ],
      },
      include: [
        { model: socioModel, as: 'socioAlcantarillado', attributes: [] },
        {
          model: calleRamalModel,
          as: 'calleAlcantarillado',
          attributes: [],
        },
        {
          model: detallePagoAccionAlcantarillado,
          as: 'detallesAlcantarrillado',
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      subQuery: false,
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
    const dataId = await accionAlcantarillado.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: detallePagoAccionAlcantarillado,
          as: 'detallesAlcantarrillado',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!dataId) {
      const err = new Error('No se encontro la accion');
      err.statusCode = 404;
      throw err;
    }

    const dataPlano = dataId.toJSON();

    const detalleAccioneIds =
      dataPlano?.detallesAlcantarrillado?.map((row) => Number(row.id)) || [];

    const dataNormalizado = {
      ...dataPlano,
      detallesAlcantarrillado: detalleAccioneIds,
    };

    return dataNormalizado;
  }
  static async create(payload) {
    return sequelize.transaction(async (t) => {
      const { socio_id, calle_id, detallesAlcantarrillado, ...parent } =
        payload;

      await Validaciones.validarSocio(socio_id, {
        transaction: t,
      });
      await Validaciones.validarCalle(calle_id, {
        transaction: t,
      });
      const detallePagoAccionSearch =
        await Validaciones.ValidadPagoAlcantarillado(detallesAlcantarrillado, {
          transaction: t,
        });

      const ultimaAccion = await accionAlcantarillado.findOne({
        order: [['codigo_interno', 'DESC']],
        attributes: ['codigo_interno'],
        transaction: t,
        raw: true,
      });

      const nuevoCodigo = ultimaAccion
        ? Number(ultimaAccion.codigo_interno) + 1
        : 1;

      const accionCreated = await accionAlcantarillado.create(
        {
          ...parent,
          socio_id,
          calle_id,
          codigo_interno: nuevoCodigo,
        },
        {
          transaction: t,
        },
      );
      const payloadAcciones = detallePagoAccionSearch.map((row) => ({
        accion_alcantarillado_id: accionCreated.id,
        detalle_alcantarillado_id: row.id,
      }));

      const tablaItermediariaAccionCreate =
        await accionAlcantarilladoDetalle.bulkCreate(payloadAcciones, {
          transaction: t,
        });
      //
      const peridoActivo = await Validaciones.ObtenerPeriodoActivo({
        transaction: t,
      });

      const cobroPayload = detallePagoAccionSearch.map((row) => ({
        socio_id,
        accion_id: 5000 + accionCreated.id,
        periodo_id: peridoActivo.id,
        tipo_cobro: 'ACCION_ALCANTARILLADO',
        concepto: row.nombre_accion,
        descripcion: `Cobro de accion alcantarillado del codigo ${nuevoCodigo}`,
        monto_total: row.precio_accion,
        saldo: row.precio_accion,
      }));

      const cobroCreate = await cobroModel.bulkCreate(cobroPayload, {
        transaction: t,
      });

      return {
        accionCreated,
        cobroCreate,
      };
    });
  }
  static async cambiarEstado(id, payload) {
    const accionSearch = await accionAlcantarillado.findByPk(id);
    if (!accionSearch) {
      const err = new Error('No se econtro la accion');
      err.statusCode = 404;
      throw err;
    }

    await accionSearch.update({ estado: !accionSearch.estado });

    return;
  }
}
