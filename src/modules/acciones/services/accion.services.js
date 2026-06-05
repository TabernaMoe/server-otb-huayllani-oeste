import { col, Op } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { accionModel } from '../../../models/accion/accion.model.js';
import { accionDetalleModel } from '../../../models/accion/accionDetalle.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { tarifaModel } from '../../../models/tarifa/tarifa.model.js';
import { detallePagoAccion } from '../../../models/accion/detallePagoAccion.model.js';
import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { cobroAccionModel } from '../../../models/cobros/tipoCobros/cobroAccion.model.js';
import { gestionModel } from '../../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../../models/gestiones/periodo.model.js';
//
import { ValidacionesSequelize as Validaciones } from '../../../validators/ValidacionesSequelize.js';

export class accionServices {
  static async getAll(page = 1, limit = 10, search = '', estado = undefined) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const valoresPermitidos = ['ACTIVO', 'PASIVO', 'ANULADO'];

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
        {
          codigo_interno: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$calleAccion.nombre_calle$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAccion.nombres$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAccion.primer_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$socioAccion.segundo_apellido$': {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          '$tarifaAccion.nombre_tarifa$': {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await accionModel.findAndCountAll({
      attributes: {
        include: [
          [col('socioAccion.nombres'), 'nombres'],
          [col('socioAccion.primer_apellido'), 'primer_apellido'],
          [col('socioAccion.segundo_apellido'), 'segundo_apellido'],
          [col('calleAccion.nombre_calle', 'nombre_calle')],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
      },
      include: [
        { model: socioModel, as: 'socioAccion', attributes: [] },
        { model: calleRamalModel, as: 'calleAccion', attributes: [] },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: detallePagoAccion,
          as: 'detallesAccion',
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
    const dataId = await accionModel.findByPk(id, {
      include: [
        { model: socioModel, as: 'socioAccion', attributes: ['id'] },
        { model: calleRamalModel, as: 'calleAccion', attributes: ['id'] },
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: ['id'],
        },
        {
          model: detallePagoAccion,
          as: 'detallesAccion',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!dataId) {
      const err = new Error('No se encotro la accion');
      err.statusCode = 404;
      throw err;
    }
    return dataId;
  }
  static async create(payload) {
    const create = await sequelize.transaction(async (t) => {
      const {
        socio_id,
        calle_id,
        tarifa_id,
        detallesAccion,
        nro_medidor,
        ...parent
      } = payload;
      const socioSarch = await Validaciones.validarSocio(socio_id, {
        transaction: t,
      });
      const calleSearch = await Validaciones.validarCalle(calle_id, {
        transaction: t,
      });
      const tarifaSearch = await Validaciones.validarTarifa(tarifa_id, {
        transaction: t,
      });

      const detallePagoAccionSearch = await Validaciones.ValidarPagoAcciones(
        detallesAccion,
        { transaction: t },
      );

      const nroAcciones = await accionModel.count({ transaction: t });

      const nroMedidorSearch = await accionModel.findOne({
        where: {
          nro_medidor,
        },
        transaction: t,
      });

      if (nroMedidorSearch) {
        const err = new Error('Ya hay una accion con ese nro de medidor');
        err.statusCode = 400;
        throw err;
      }

      const accionCreated = await accionModel.create(
        {
          ...parent,
          socio_id,
          calle_id,
          tarifa_id,
          codigo_interno: nroAcciones,
          nro_medidor,
        },
        {
          transaction: t,
        },
      );

      const payloadAcciones = detallesAccion.map((row) => ({
        accion_id: accionCreated.id,
        detalle_pago_accion_id: row.id,
      }));

      const tablaItermediariaAccionCreate = await accionDetalleModel.bulkCreate(
        payloadAcciones,
        { transaction: t },
      );

      //

      const peridoActivo = await Validaciones.ObtenerPeriodoActivo({
        transaction: t,
      });

      const cobroPayload = detallePagoAccionSearch.map((row) => ({
        socio_id,
        periodo_id: peridoActivo.id,
        tipo_cobro: 'ACCION',
        concepto: row.nombre_accion,
        descripcion: `Cobro de accion del codigo ${nroAcciones}`,
        monto_total: row.precio_accion,
        saldo: row.precio_accion,
      }));

      const cobroCreate = await cobroModel.bulkCreate(cobroPayload, {
        transaction: t,
      });

      const payloadDetalleAccion = await accionModel.findByPk(
        accionCreated.id,
        {
          include: [
            {
              model: detallePagoAccion,
              as: 'detallesAccion',
              attributes: ['id', 'precio_accion', 'nombre_accion'],
              through: {
                attributes: ['id'],
              },
            },
          ],
          transaction: t,
        },
      );

      const ObjAcciones = payloadDetalleAccion.detallesAccion;

      const payloadCobrosAcciones = detallePagoAccionSearch.map((row) => {
        const detalleAccion = ObjAcciones.find((p) => p.id == row.id);
        const cobtroAccion = cobroCreate.find(
          (p) => p.concepto == row.nombre_accion,
        );

        return {
          accion_id: accionCreated.id,
          cobro_id: cobtroAccion.id,
          accion_detalle_id: detalleAccion.accion_detalle.id,
          precio: detalleAccion.precio_accion,
        };
      });

      const cobroAccion = await cobroAccionModel.bulkCreate(
        payloadCobrosAcciones,
        { transaction: t },
      );
      return {
        accionCreated,
        tablaItermediariaAccionCreate,
        cobroCreate,
        cobroAccion,
      };
    });
    return create;
  }
  static async update(id, payload) {}
  static async toggleStatus() {}
}
