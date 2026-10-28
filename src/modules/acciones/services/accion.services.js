import {
  col,
  fn,
  literal,
  Op,
  Sequelize,
  cast,
  where as sequelizeWhere,
} from 'sequelize';
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
import { lecturaAguaModel } from '../../../models/lecturasAgua/lecturasAgua.model.js';
//
import { ValidacionesSequelize as Validaciones } from '../../../validators/ValidacionesSequelize.js';

export class accionServices {
  static async getAll(
    page = 1,
    limit = 10,
    search = '',
    estado = undefined,
  ) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;
    search = search?.trim() || '';

    const estadosPermitidos = ['ACTIVO', 'PASIVO', 'ANULADO'];

    if (estado !== undefined && !estadosPermitidos.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${estadosPermitidos.join(', ')}`,
      );
      error.statusCode = 400;
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
          { [Op.iLike]: `%${search}%` },
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

    const buildInclude = () => [
      {
        model: socioModel,
        as: 'socioAccion',
        attributes: [],
      },
      {
        model: calleRamalModel,
        as: 'calleAccion',
        attributes: [],
      },
      {
        model: tarifaModel,
        as: 'tarifaAccion',
        attributes: [],
      },
    ];

    /*
     * Separamos COUNT y SELECT.
     *
     * findAndCountAll + LIMIT + joins puede producir un count correcto
     * pero menos filas de las solicitadas cuando Sequelize arma subqueries.
     * Como estas relaciones son belongsTo (1 a 1), subQuery:false es seguro.
     */
    const total = await accionModel.count({
      where,
      include: buildInclude(),
      distinct: true,
      col: 'id',
    });

    const rows = await accionModel.findAll({
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
              col('socioAccion.nombres'),
              col('socioAccion.primer_apellido'),
              col('socioAccion.segundo_apellido'),
            ),
            'nombre_completo',
          ],
          [col('calleAccion.nombre_calle'), 'nombre_calle'],
          [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        ],
      },
      include: buildInclude(),
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      subQuery: false,
    });

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
          attributes: ['id', 'tipo_accion_id'],
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
      dataPlano.detallesAccion?.map((row) => Number(row.id)) || [];

    const dataNormalizado = {
      ...dataPlano,
      detallesAccion: detalleAccioneIds,
      tipo_accion_id: dataPlano.detallesAccion?.[0]?.tipo_accion_id ?? null,
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
      await Validaciones.validarSocio(socio_id, {
        transaction: t,
      });
      await Validaciones.validarCalle(calle_id, {
        transaction: t,
      });
      await Validaciones.validarTarifa(tarifa_id, {
        transaction: t,
      });

      const detallePagoAccionSearch = await Validaciones.ValidarPagoAcciones(
        detallesAccion,
        { transaction: t },
      );

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
      }

      const estadosPermitidos = ['ACTIVO', 'PASIVO'];
      const esValido = estadosPermitidos.includes(estado);

      if (!esValido) {
        const err = new Error('No existe ese estado');
        err.statusCode = 400;
        throw err;
      }
      const ultimaAccion = await accionModel.findOne({
        order: [['codigo_interno', 'DESC']],
        attributes: ['codigo_interno'],
        transaction: t,
        raw: true,
      });

      const nuevoCodigo = ultimaAccion
        ? Number(ultimaAccion.codigo_interno) + 1
        : 1;

      const accionCreated = await accionModel.create(
        {
          ...parent,
          socio_id,
          calle_id,
          tarifa_id,
          codigo_interno: nuevoCodigo,
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
        descripcion: `Cobro de accion del codigo ${nuevoCodigo}`,
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
  static async cambiarEstado(id, payload) {
    const { estado } = payload;

    const accionSearch = await accionModel.findByPk(id);
    if (!accionSearch) {
      const err = new Error('No se econtro la accion');
      err.statusCode = 404;
      throw err;
    }

    const estadosAccion = ['ACTIVO', 'PASIVO', 'ANULADO'];
    if (!estadosAccion.includes(estado)) {
      const error = new Error(
        `Estado inválido. Valores permitidos: ${estadosAccion.join(', ')}`,
      );
      error.statusCode = 400;
      throw error;
    }
    //--------------ANULADO

    if (estado === 'ANULADO') {
      const cobroSearch = await cobroModel.findOne({
        where: {
          accion_id: id,
          estado: {
            [Op.in]: ['PENDIENTE', 'PARCIAL', 'PAGADO'],
          },
        },
      });
      if (cobroSearch) {
        const err = new Error(
          'No se pude cambiar el estado porque tiene cobros pendientes o falta completar cobros',
        );
        err.statusCode = 409;
        throw err;
      }
      const lecturas = await lecturaAguaModel.findOne({
        where: {
          accion_id: id,
        },
      });
      if (lecturas) {
        const err = new Error(
          'No se pude cambiar el estado porque tiene lecturas',
        );
        err.statusCode = 409;
        throw err;
      }
    }
    //-------------PASIVO
    if (estado === 'PASIVO') {
      const lecturas = await lecturaAguaModel.findOne({
        where: {
          accion_id: id,
        },
      });
      if (lecturas) {
        const err = new Error(
          'No se pude cambiar el estado porque tiene lecturas',
        );
        err.statusCode = 409;
        throw err;
      }
    }
    //-------------

    await accionSearch.update({ estado });

    return;
  }
  static async cambiarNombreAccion(id, payload) {
    const data = await sequelize.transaction(async (t) => {
      const { nuevoSocioId, tipo = '' } = payload;
      const accionSearch = await accionModel.findByPk(id, { transaction: t });
      if (!accionSearch) {
        const err = new Error('No se econtro la accion');
        err.statusCode = 404;
        throw err;
      }
      //
      const existeCobros = await cobroModel.findOne({
        where: {
          accion_id: id,
          estado: {
            [Op.in]: ['PENDIENTE', 'PARCIAL'],
          },
        },
        transaction: t,
      });

      if (existeCobros) {
        const err = new Error(
          'Para cambiar el nombre de la accion no debe tener deudas pendientes',
        );
        err.statusCode = 409;
        throw err;
      }
      const buscarSocioAnterior = await socioModel.findByPk(
        accionSearch.socio_id,
        { transaction: t },
      );
      //
      const buscarSocio = await socioModel.findByPk(nuevoSocioId, {
        transaction: t,
      });
      if (!buscarSocio) {
        const err = new Error('No se encontro el socio');
        err.statusCode = 404;
        throw err;
      }
      //
      if (tipo == 'FAMILIAR') {
        await accionSearch.update(
          { socio_id: nuevoSocioId },
          { transaction: t },
        );
        return accionSearch;
      }
      if (tipo == 'PARTICULAR') {
        await accionSearch.update(
          { socio_id: nuevoSocioId },
          { transaction: t },
        );

        const gestionSearch = await gestionModel.findOne({
          where: {
            estado: 'ACTIVO',
          },
          transaction: t,
        });
        if (!gestionSearch) {
          const err = new Error('No se encontro gestion acctiva');
          err.statusCode = 404;
          throw err;
        }

        const periodoSearch = await periodoModel.findOne({
          where: {
            gestion_id: gestionSearch.id,
            estado: 'ACTIVO',
          },
          transaction: t,
        });
        if (!periodoSearch) {
          const err = new Error('No se encontro gestion acctiva');
          err.statusCode = 404;
          throw err;
        }

        await cobroModel.create(
          {
            socio_id: nuevoSocioId,
            accion_id: id,
            periodo_id: periodoSearch.id,
            tipo_cobro: 'CAMBIO_NOMBRE_ACCION',
            concepto: 'CAMBIO DE NOMBRE',
            descripcion: `CAMBIO DE ACCION DE ${buscarSocioAnterior.ci_socio} ${buscarSocioAnterior.nombres} ${buscarSocioAnterior.primer_apellido} ${buscarSocioAnterior.segundo_apellido} a ${buscarSocio.ci_socio} ${buscarSocio.nombres} ${buscarSocio.primer_apellido} ${buscarSocio.segundo_apellido}`,
            monto_total: 350,
            saldo: 350,
            estado: 'PENDIENTE',
          },
          { transaction: t },
        );

        return accionSearch;
      }
      throw new Error('Algo salio mal al cambiar de nombre');
    });
    return data;
  }
  static async getAcciones(page = 1, limit = 10, search = '') {
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    search = search?.trim() || '';

    const where = {};

    where.estado = {
      [Op.in]: ['ACTIVO', 'PASIVO'],
    };

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
          'observacion',
          'direccion',
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
  static async getSelect(search = '') {
    search = search?.trim() || '';
    console.log('pasa por aca');
    let where = {
      estado: {
        [Op.ne]: 'ANULADO',
      },
    };
    if (search) {
      where[Op.or] = [
        // codigo_interno es numérico, lo convertimos a texto
        sequelizeWhere(cast(col('codigo_interno'), 'TEXT'), {
          [Op.iLike]: `%${search}%`,
        }),

        {
          '$socioAccion.ci_socio$': {
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
      ];
    }

    const data = await accionModel.findAll({
      attributes: [
        ['id', 'value'],
        [
          fn(
            'CONCAT_WS',
            ' ',
            col('codigo_interno'),
            '-',
            col('socioAccion.ci_socio'),
            col('socioAccion.nombres'),
            col('socioAccion.primer_apellido'),
            col('socioAccion.segundo_apellido'),
          ),
          'label',
        ],
      ],
      include: [
        {
          model: socioModel,
          as: 'socioAccion',
          attributes: [],
        },
      ],
      where,
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async getDataPdf(id) {
    const accion = await accionModel.findByPk(id, {
      attributes: [
        'socio_id',
        'codigo_interno',
        'nro_medidor',
        [col('tarifaAccion.nombre_tarifa'), 'tarifa'],
        [col('calleAccion.nombre_calle'), 'calle'],
        'direccion',
        'observacion',
        'estado',
        ['created_at', 'fechaRegistro'],
      ],
      include: [
        {
          model: tarifaModel,
          as: 'tarifaAccion',
          attributes: [],
        },
        {
          model: calleRamalModel,
          as: 'calleAccion',
          attributes: [],
        },
      ],
      raw: true,
    });
    if (!accion) {
      const err = new Error('No se encontro la accion');
      err.statusCode = 404;
      throw err;
    }

    const socio = await socioModel.findByPk(accion.socio_id, {
      attributes: [
        'ci_socio',
        'nombres',
        'primer_apellido',
        'segundo_apellido',
        'numero_celular',
      ],
      raw: true,
    });

    const cobros = await accionDetalleModel.findAll({
      attributes: [
        [col('detalleAccionAD.nombre_accion'), 'nombre_accion'],
        [col('detalleAccionAD.precio_accion'), 'precio_accion'],
      ],
      where: { accion_id: id },
      include: [
        {
          model: detallePagoAccion,
          as: 'detalleAccionAD',
          attributes: [],
        },
      ],
      raw: true,
    });
    if (!socio) {
      const err = new Error('No se encontro el socio asociado a la accion');
      err.statusCode = 404;
      throw err;
    }
    return { accion, socio, cobros };
  }
}
