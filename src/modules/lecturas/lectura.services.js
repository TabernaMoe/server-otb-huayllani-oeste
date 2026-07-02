import { col, fn, literal, Op } from 'sequelize';
import { lecturaAguaModel } from '../../models/lecturasAgua/lecturasAgua.model.js';
import { cambioMedidor } from '../../models/lecturasAgua/cambioMedidor.model.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { id } from 'zod/locales';
import { sequelize } from '../../config/database.js';
import { ValidacionesSequelize as validaciones } from '../../validators/ValidacionesSequelize.js';
//
import { cobroAguaModel } from '../../models/cobros/tipoCobros/cobroAgua.model.js';
//
import { cobroModel } from '../../models/cobros/cobro.model.js';
//
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';
import { rangoTarifaModel } from '../../models/tarifa/rango.model.js';
import { socioModel } from '../../models/socio.model.js';
import { detallePagoAccion } from '../../models/accion/detallePagoAccion.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';

export class LecturaServices {
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
        sequelize.where(
          sequelize.cast(sequelize.col('acciones.codigo_interno'), 'TEXT'),
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
      where,
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
          through: { attributes: [] },
        },
        {
          model: lecturaAguaModel,
          as: 'lecturas',
          separate: true,
          limit: 1,
          order: [['id', 'DESC']],
        },
      ],
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

  static async getAllDetalles(id_accion, page = 1, limit = 10, search = '') {}

  static async getId(accion_id) {
    const data = await accionModel.findByPk(accion_id, {
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
          through: { attributes: [] },
        },
        {
          model: lecturaAguaModel,
          as: 'lecturas',
          separate: true,
          limit: 1,
          order: [['id', 'DESC']],
        },
      ],
    });
    if (!data) {
      const err = new Error('No se encontro la accion');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async create(accion_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { lectura_actual, observacion } = payload;

      const accionSearch = await accionModel.findByPk(accion_id, {
        transaction: t,
      });

      if (!accionSearch) {
        const err = new Error('No se encontró la acción');
        err.statusCode = 404;
        throw err;
      }

      const ultimaLectura = await lecturaAguaModel.findOne({
        where: { accion_id },
        order: [['id', 'DESC']],
        transaction: t,
      });

      const periodoActivo = await validaciones.ObtenerPeriodoActivo(t);

      const lecturaAnterior = ultimaLectura
        ? Number(ultimaLectura.lectura_actual)
        : 0;

      let cambioMedidorM3 = 0;

      if (ultimaLectura?.ultimaLectura === 0) {
        const cambio = await cambioMedidor.findOne({
          where: {
            lectura_agua_id: ultimaLectura.id,
          },
          order: [['id', 'DESC']],
        });

        cambioMedidorM3 = cambio ? Number(cambio.consumo_m3) : 0;
      }

      const consumoM3 =
        Number(lectura_actual) - lecturaAnterior + cambioMedidorM3;

      if (consumoM3 < 0) {
        const err = new Error(
          'La lectura actual no puede ser menor a la anterior',
        );
        err.statusCode = 400;
        throw err;
      }

      const createdLectura = await lecturaAguaModel.create(
        {
          accion_id: accionSearch.id,
          periodo_id: periodoActivo.id,
          lectura_anterior: lecturaAnterior,
          lectura_actual: Number(lectura_actual),
          consumo_m3: consumoM3,
          observacion,
        },
        { transaction: t },
      );

      const tarifaSearch = await tarifaModel.findByPk(accionSearch.tarifa_id, {
        include: [
          {
            model: rangoTarifaModel,
            as: 'rangosTarifa',
            separate: true,
            order: [['consumo_minimo', 'ASC']],
          },
        ],
        transaction: t,
      });

      if (!tarifaSearch) {
        const err = new Error('No se encontró la tarifa');
        err.statusCode = 404;
        throw err;
      }

      let consumoRestante = consumoM3;
      let total_pagar = 0;

      for (const rango of tarifaSearch.rangosTarifa) {
        if (consumoRestante <= 0) break;

        const minimo = Number(rango.consumo_minimo);
        const maximo = Number(rango.consumo_maximo);
        const precio = Number(rango.precio);

        const cantidadRango = maximo - minimo;
        const consumoCobrado = Math.min(consumoRestante, cantidadRango);

        total_pagar += consumoCobrado * precio;
        consumoRestante -= consumoCobrado;
      }

      const cobroCreated = await cobroModel.create(
        {
          socio_id: accionSearch.socio_id,
          periodo_id: periodoActivo.id,
          tipo_cobro: 'LECTURA_AGUA',
          concepto: `LECTURA DEL MES ${periodoActivo.mes}`,
          descripcion: `LECTURA DEL MES ${periodoActivo.mes}`,
          monto_total: total_pagar,
          saldo: total_pagar,
        },
        { transaction: t },
      );

      await cobroAguaModel.create(
        {
          lectura_agua_id: createdLectura.id,
          cobro_id: cobroCreated.id,
          consumo_m3: consumoM3,
          total_pagar,
        },
        { transaction: t },
      );

      return createdLectura;
    });
  }
  static async update(accion_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { lectura_actual, observacion } = payload;

      const accionSearch = await accionModel.findByPk(accion_id, {
        transaction: t,
      });

      if (!accionSearch) {
        const err = new Error('No se encontró la acción');
        err.statusCode = 404;
        throw err;
      }
      const lectura = await lecturaAguaModel.findOne({
        where: {
          accion_id: accion_id,
        },
        order: [['id', 'DESC']],
        transaction: t,
      });

      const lecturaAnteriorData = await lecturaAguaModel.findOne({
        where: {
          accion_id: accion_id,
          id: { [Op.lt]: lectura.id },
        },
        order: [['id', 'DESC']],
        transaction: t,
      });

      const lecturaAnterior = lecturaAnteriorData
        ? Number(lecturaAnteriorData.lectura_actual)
        : 0;

      let huboCambioM3 = 0;

      const HuboCambio = await cambioMedidor.findOne({
        where: {
          lectura_agua_id: lectura.id,
        },
        transaction: t,
      });

      if (HuboCambio) {
        huboCambioM3 = HuboCambio.consumo_m3;
      }

      const consumoM3 = Number(lectura_actual) - lecturaAnterior + huboCambioM3;

      if (consumoM3 < 0) {
        const err = new Error(
          'La lectura actual no puede ser menor a la anterior',
        );
        err.statusCode = 400;
        throw err;
      }

      await lectura.update(
        {
          lectura_anterior: lecturaAnterior,
          lectura_actual: Number(lectura_actual),
          consumo_m3: consumoM3,
          observacion,
        },
        { transaction: t },
      );

      const tarifaSearch = await tarifaModel.findByPk(accionSearch.tarifa_id, {
        include: [
          {
            model: rangoTarifaModel,
            as: 'rangosTarifa',
            separate: true,
            order: [['consumo_minimo', 'ASC']],
          },
        ],
        transaction: t,
      });

      let consumoRestante = consumoM3;
      let total_pagar = 0;

      for (const rango of tarifaSearch.rangosTarifa) {
        if (consumoRestante <= 0) break;

        const minimo = Number(rango.consumo_minimo);
        const maximo = Number(rango.consumo_maximo);
        const precio = Number(rango.precio);

        const cantidadRango = maximo - minimo;
        const consumoCobrado = Math.min(consumoRestante, cantidadRango);

        total_pagar += consumoCobrado * precio;
        consumoRestante -= consumoCobrado;
      }

      const cobroAgua = await cobroAguaModel.findOne({
        where: { lectura_agua_id: lectura.id },
        transaction: t,
      });

      if (!cobroAgua) {
        const err = new Error('No se encontró el cobro de agua');
        err.statusCode = 404;
        throw err;
      }

      await cobroAgua.update(
        {
          consumo_m3: consumoM3,
          total_pagar,
        },
        { transaction: t },
      );

      const cobro = await cobroModel.findByPk(cobroAgua.cobro_id, {
        transaction: t,
      });

      if (!cobro) {
        const err = new Error('No se encontró el cobro');
        err.statusCode = 404;
        throw err;
      }

      await cobro.update(
        {
          monto_total: total_pagar,
          saldo: total_pagar,
        },
        { transaction: t },
      );

      return lectura;
    });
  }
  static async ChangeMedidor(accion_id, payload) {
    return await sequelize.transaction(async (t) => {
      const { lectura_actual, observacion } = payload;

      const accionSearch = await accionModel.findByPk(accion_id, {
        transaction: t,
      });

      if (!accionSearch) {
        const err = new Error('No se encontró la acción');
        err.statusCode = 404;
        throw err;
      }

      const ultimaLectura = await lecturaAguaModel.findOne({
        where: { accion_id },
        order: [['id', 'DESC']],
        transaction: t,
      });

      const lecturaAnterior = ultimaLectura
        ? Number(ultimaLectura.lectura_actual)
        : 0;

      const consumoM3 = Number(lectura_actual) - lecturaAnterior;

      if (consumoM3 < 0) {
        const err = new Error(
          'La lectura final del medidor viejo no puede ser menor a la anterior',
        );

        err.statusCode = 400;
        throw err;
      }
      const periodoActivo = await validaciones.ObtenerPeriodoActivo();

      const createdLectura = await lecturaAguaModel.create(
        {
          accion_id: accionSearch.id,
          periodo_id: periodoActivo.id,
          lectura_anterior: lecturaAnterior,
          lectura_actual: 0,
          consumo_m3: consumoM3,
          observacion: observacion || 'Cambio de medidor',
        },
        { transaction: t },
      );

      const createdChangeMedidor = await cambioMedidor.create(
        {
          lectura_agua_id: createdLectura.id,
          consumo_m3: consumoM3,
        },
        {
          transaction: t,
        },
      );

      const lecturaReload = await lecturaAguaModel.findByPk(createdLectura.id, {
        include: [{ model: cambioMedidor, as: 'cambioMedidor' }],
        transaction: t,
      });

      return lecturaReload;
    });
  }
}
