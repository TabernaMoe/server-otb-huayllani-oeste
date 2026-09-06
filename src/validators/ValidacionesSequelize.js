import { Op } from 'sequelize';
import { calleRamalModel } from '../models/calleRamal.model.js';
import { socioModel } from '../models/socio.model.js';
import { tarifaModel } from '../models/tarifa/tarifa.model.js';
import { detallePagoAccion } from '../models/accion/detallePagoAccion.model.js';
import { gestionModel } from '../models/gestiones/gestion.model.js';
import { periodoModel } from '../models/gestiones/periodo.model.js';
import { detallePagoAccionAlcantarillado } from '../models/accionAlcantarillado/detallePagoAccionAlcantarillado.model.js';

export class ValidacionesSequelize {
  static async ObtenerPeriodoActivo(options = {}) {
    const gestionActiva = await gestionModel.findOne({
      where: {
        estado: 'ACTIVO',
      },
      options,
    });
    if (!gestionActiva) {
      const err = new Error('No hay gestion activa');
      err.statusCode = 400;
      throw err;
    }

    const peridoActivo = await periodoModel.findOne({
      where: {
        gestion_id: gestionActiva.id,
        estado: 'ACTIVO',
      },
      options,
    });

    if (!peridoActivo) {
      const err = new Error('No hay perido activo');
      err.statusCode = 400;
      throw err;
    }
    return peridoActivo;
  }
  static async validarSocio(id, options = {}) {
    const socioSearch = await socioModel.findByPk(id, options);
    if (!socioSearch) {
      const err = new Error('No se encotro el socio');
      err.statusCode = 404;
      throw err;
    }
    return socioSearch;
  }
  static async validarCalle(id, options) {
    const calleSearch = await calleRamalModel.findByPk(id, options);
    if (!calleSearch) {
      const err = new Error('No se encotro la calle');
      err.statusCode = 404;
      throw err;
    }
    return calleSearch;
  }
  static async validarTarifa(id, options) {
    const tarifaSearch = await tarifaModel.findByPk(id, options);
    if (!tarifaSearch) {
      const err = new Error('No se encotro la tarifa');
      err.statusCode = 404;
      throw err;
    }
    return tarifaSearch;
  }

  static async ValidarPagoAcciones(array, options = {}) {
    const detallePagoAccionIds = [...new Set(array)];

    const detallePagoAccionSearch = await detallePagoAccion.findAll({
      where: {
        id: {
          [Op.in]: detallePagoAccionIds,
        },
      },
      ...options,
    });

    if (detallePagoAccionSearch.length !== detallePagoAccionIds.length) {
      const err = new Error('Uno o varios detalles de accion no existen');
      err.statusCode = 404;
      throw err;
    }
    return detallePagoAccionSearch;
  }
  static async ValidadPagoAlcantarillado(array, options = {}) {
    const detallePagoAccionIds = [...new Set(array)];

    const detallePagoAccionSearch =
      await detallePagoAccionAlcantarillado.findAll({
        where: {
          id: {
            [Op.in]: detallePagoAccionIds,
          },
        },
        ...options,
      });

    if (detallePagoAccionSearch.length !== detallePagoAccionIds.length) {
      const err = new Error('Uno o varios detalles de accion no existen');
      err.statusCode = 404;
      throw err;
    }
    return detallePagoAccionSearch;
  }
}
