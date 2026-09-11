import cambioNombreRepository from './cambioNombre.respository.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { cobroCambioNombreModel } from '../../models/cobros/tipoCobros/cobroCambioNombre.model.js';

import { socioModel } from '../../models/socio.model.js';
import { sequelize } from '../../config/database.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { cambiarNombreModel } from '../../models/cambioNombre.model.js';
import { ValidacionesSequelize as validators } from '../../validators/ValidacionesSequelize.js';

class CambioNombreService {
  static async getAll({ queryPage, queryLimit, querySearch, queryEstado }) {
    const page = Number(queryPage) || 1;
    const limit = Number(queryLimit) || 10;

    let search = querySearch;
    let estado = queryEstado;

    search =
      search && search !== 'undefined' && search !== 'null'
        ? search.trim()
        : '';

    if (estado === 'true') {
      estado = true;
    } else if (estado === 'false') {
      estado = false;
    } else {
      estado = undefined;
    }

    const data = await cambioNombreRepository.getAll(
      page,
      limit,
      search,
      estado,
    );
    return data;
  }
  static async getById(id) {
    const data = await cambioNombreRepository.getById(id);
    if (!data) {
      const err = new Error('No se encontro el usuario');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
  static async create(payload) {
    const { accion_id, socio_nuevo_id, tipo, observacion, monto } = payload;
    return sequelize.transaction(async (t) => {
      const accion = await accionModel.findByPk(accion_id, {
        transaction: t,
      });

      if (!accion) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }

      const socioAntiguo = await socioModel.findByPk(accion.socio_id, {
        transaction: t,
      });
      const socioNuevo = await socioModel.findByPk(socio_nuevo_id, {
        transaction: t,
      });

      if (!socioAntiguo || !socioNuevo) {
        const err = new Error('No se encontro el socio');
        err.statusCode = 404;
        throw err;
      }
      if (tipo === 'FAMILIAR') {
        const cambioNombreCreate = await cambioNombreRepository.create({
          payload: {
            accion_id: accion.id,
            socio_antiguo_id: socioAntiguo.id,
            socio_nuevo_id: socioNuevo.id,
            socio_antiguo_snapshot: `${socioAntiguo.ci_socio} ${socioAntiguo.nombres} ${socioAntiguo.primer_apellido} ${socioAntiguo.segundo_apellido}`,
            socio_nuevo_snapshot: `${socioNuevo.ci_socio} ${socioNuevo.nombres} ${socioNuevo.primer_apellido} ${socioNuevo.segundo_apellido}`,
            tipo,
            observacion,
            monto: 0,
          },
          transaction: t,
        });
        await accion.update({ socio_id: socioNuevo.id }, { transaction: t });
        return cambioNombreCreate;
      }
      if (tipo === 'AJENO') {
        const cambioNombreCreate = await cambioNombreRepository.create({
          payload: {
            accion_id: accion.id,
            socio_antiguo_id: socioAntiguo.id,
            socio_nuevo_id: socioNuevo.id,
            socio_antiguo_snapshot: `${socioAntiguo.ci_socio} ${socioAntiguo.nombres} ${socioAntiguo.primer_apellido} ${socioAntiguo.segundo_apellido}`,
            socio_nuevo_snapshot: `${socioNuevo.ci_socio} ${socioNuevo.nombres} ${socioNuevo.primer_apellido} ${socioNuevo.segundo_apellido}`,
            tipo,
            observacion,
            monto,
          },
          transaction: t,
        });
        const periodo = await validators.ObtenerPeriodoActivo({
          transaction: t,
        });
        await accion.update({ socio_id: socioNuevo.id }, { transaction: t });
        const cobro = await cobroModel.create(
          {
            socio_id: socioNuevo.id,
            accion_id: accion.id,
            periodo_id: periodo.id,
            tipo_cobro: 'CAMBIO_NOMBRE_ACCION',
            concepto: 'CAMBIO DE NOMBRE A AJENO',
            descripcion: `Cambio de nombre de ${socioAntiguo.ci_socio} ${socioAntiguo.nombres} ${socioAntiguo.primer_apellido} ${socioAntiguo.segundo_apellido} a ${socioNuevo.ci_socio} ${socioNuevo.nombres} ${socioNuevo.primer_apellido} ${socioNuevo.segundo_apellido}`,
            monto_total: monto,
            saldo: monto,
          },
          {
            transaction: t,
          },
        );
        await cobroCambioNombreModel.create(
          {
            cobro_id: cobro.id,
            cambio_nombre_id: cambioNombreCreate.id,
            monto,
          },
          {
            transaction: t,
          },
        );
        return cambioNombreCreate;
      }
    });
  }
}

export default CambioNombreService;
