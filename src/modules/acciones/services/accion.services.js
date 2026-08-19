import { col, fn, literal, Op, Sequelize } from 'sequelize';
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
        Sequelize.where(
          Sequelize.cast(Sequelize.col('acciones.codigo_interno'), 'TEXT'),
          {
            [Op.iLike]: `%${search}%`,
          },
        ),
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
        exclude: [
          'socio_id',
          'calle_id',
          'tarifa_id',
          'createdAt',
          'updatedAt',
        ],
        include: [
          [
            fn(
              'CONCAT_WS',
              ' ',
              col(`socioAccion.nombres`),
              col(`socioAccion.primer_apellido`),
              col(`socioAccion.segundo_apellido`),
            ),
            'nombre_completo',
          ],
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
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
    const dataId = await accionModel.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
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

    const dataPlano = dataId.toJSON();

    const detalleAccioneIds =
      dataPlano.detallesAccion?.map((row) => Number(row.id)) || [];

    const dataNormalizado = {
      ...dataPlano,
      detallesAccion: detalleAccioneIds,
    };

    return dataNormalizado;
  }
  static async create(payload) {
    const create = await sequelize.transaction(async (t) => {
      const {
        socio_id,
        calle_id,
        tarifa_id,
        detallesAccion,
        nro_medidor,
        estado,
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

      const estadosPermitidos = ['ACTIVO', 'PASIVO'];
      const esValido = estadosPermitidos.includes(estado);

      if (!esValido) {
        const err = new Error('No existe ese estado');
        err.statusCode = 400;
        throw err;
      }

      const accionCreated = await accionModel.create(
        {
          ...parent,
          socio_id,
          calle_id,
          tarifa_id,
          codigo_interno: nroAcciones + 1,
          nro_medidor,
          estado,
        },
        {
          transaction: t,
        },
      );

      const payloadAcciones = detallePagoAccionSearch.map((row) => ({
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
        accion_id: accionCreated.id,
        periodo_id: peridoActivo.id,
        tipo_cobro: 'ACCION',
        concepto: row.nombre_accion,
        descripcion: `Cobro de accion del codigo ${nroAcciones + 1}`,
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
  static async update(id, payload) {
    const update = sequelize.transaction(async (t) => {
      const {
        calle_id,
        tarifa_id,
        nro_medidor,
        detallesAccion,
        direccion,
        observacion,
        estado,
      } = payload;

      const accionSearch = await accionModel.findByPk(id, { transaction: t });
      if (!accionSearch) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }

      let dataUpdate = {};
      if (calle_id) {
        const calleSearch = await Validaciones.validarCalle(calle_id, {
          transaction: t,
        });
        dataUpdate.calle_id = calleSearch.id;
      }
      if (tarifa_id) {
        const tarifaSearch = await Validaciones.validarTarifa(tarifa_id, {
          transaction: t,
        });
        dataUpdate.tarifa_id = tarifaSearch.id;
      }
      if (nro_medidor) {
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
        dataUpdate.nro_medidor = nro_medidor;
      }
      if (direccion) {
        dataUpdate.direccion = direccion;
      }
      if (observacion) {
        dataUpdate.observacion = observacion;
      }
      if (estado) {
        const estadosPermitidos = ['ACTIVO', 'PASIVO'];
        const esValido = estadosPermitidos.includes(estado);

        if (!esValido) {
          const err = new Error('No existe ese estado');
          err.statusCode = 400;
          throw err;
        }
        dataUpdate.estado = estado;
      }

      if (Array.isArray(detallesAccion)) {
        const detallePagoAccionSearch = await Validaciones.ValidarPagoAcciones(
          detallesAccion,
          { transaction: t },
        );
        const detallesPagoAccionActual = await accionSearch.getDetallesAccion();

        function encontrarFaltantesOptimizado(
          completos,
          parciales,
          propiedad = 'id',
        ) {
          const setParcial = new Set(parciales.map((item) => item[propiedad]));
          return completos.filter((item) => !setParcial.has(item[propiedad]));
        }
        const faltantes = encontrarFaltantesOptimizado(
          detallesPagoAccionActual,
          detallePagoAccionSearch,
        );

        const faltantesId = faltantes.map((row) => row.id);

        const tablaIntermedia = await accionDetalleModel.findAll({
          attributes: ['id'],
          where: {
            accion_id: accionSearch.id,
            detalle_pago_accion_id: {
              [Op.in]: faltantesId,
            },
          },
          transaction: t,
        });

        const tablaIntermediaIds = tablaIntermedia.map((row) => row.id);

        const cobroAcciones = await cobroAccionModel.findAll({
          where: {
            accion_id: accionSearch.id,
            accion_detalle_id: {
              [Op.in]: tablaIntermediaIds,
            },
          },
          transaction: t,
        });

        const cobroAccionesIds = cobroAcciones.map((row) => row.id);

        const cobrosSearch = await cobroModel.findAll({
          where: {
            id: {
              [Op.in]: cobroAccionesIds,
            },
          },
          transaction: t,
        });

        const CobrosEstado = cobrosSearch.filter(
          (row) => row.estado === 'PENDIENTE',
        );

        if (CobrosEstado.length > 0) {
          const err = new Error(
            'No se puede eliminar algunos detalles pago accion porque ya fueron pagados o estan en proceso de pago',
          );
          throw err;
        }
        const cobrosIds = cobrosSearch.map((row) => row.id);

        await cobroAccionModel.destroy({
          where: {
            cobro_id: {
              [Op.in]: cobrosIds,
            },
          },
          transaction: t,
        });
        await cobroModel.destroy({
          where: {
            id: {
              [Op.in]: cobrosIds,
            },
          },
          transaction: t,
        });

        await accionDetalleModel.destroy({
          where: {
            accion_id: accionSearch.id,
            detalle_pago_accion_id: {
              [Op.in]: faltantesId,
            },
          },
          transaction: t,
        });
      }
      await accionSearch.update(dataUpdate, { transaction: t });

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
        transaction: t,
      });
      return dataId;
    });
    return update;
  }
}
