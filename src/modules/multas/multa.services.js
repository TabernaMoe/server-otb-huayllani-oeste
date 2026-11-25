import { Op } from 'sequelize';
import { multaModel } from '../../models/multas.model.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { cobroMultaModel } from '../../models/cobros/tipoCobros/cobroMulta.model.js';
import { ValidacionesSequelize as validaciones } from '../../validators/ValidacionesSequelize.js';

export class MultaServices {
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

      error.statusCode = 400;
      throw error;
    }

    const where = {};

    if (estado !== undefined) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        {
          nombre_multa: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows } = await multaModel.findAndCountAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
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
  static async getSelect(search) {
    search = search?.trim() || '';

    let where = { estado: true };
    if (search) {
      where = {
        [Op.and]: [
          where,
          {
            nombre_multa: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      };
    }

    const data = await multaModel.findAll({
      where,
      attributes: [
        ['id', 'value'],
        ['nombre_multa', 'label'],
      ],
      limit: 10,
      raw: true,
    });

    return data;
  }
  static async create(payload) {
    const { nombre_multa, precio } = payload;
    const nombreExiste = await multaModel.findOne({
      where: {
        nombre_multa,
      },
    });
    if (nombreExiste) {
      const err = new Error('ya existe una multa con ese nombre');
      err.statusCode = 409;
      throw err;
    }
    const data = await multaModel.create({ nombre_multa, precio });

    return data.toJSON();
  }
  static async update(id, payload) {
    const { nombre_multa, precio } = payload;

    const data = await multaModel.findByPk(id);
    if (!data) {
      const err = new Error('No se encontro la multa');
      err.statusCode = 404;
      throw err;
    }
    let dataSave = {};
    if (nombre_multa) {
      const nombreExiste = await multaModel.findOne({
        where: {
          nombre_multa,
        },
      });
      if (nombreExiste) {
        const err = new Error('ya existe una multa con ese nombre');
        err.statusCode = 409;
        throw err;
      }
      dataSave.nombre_multa = nombre_multa;
    }
    if (precio) {
      dataSave.precio = precio;
    }
    if (Object.keys(dataSave).length === 0) {
      const err = new Error('Debe enviar al menos un valor');
      err.statusCode = 404;
      throw err;
    }
    await data.update(dataSave);

    return data.toJSON();
  }
  static async changeStatus(id) {
    const dataId = await multaModel.findByPk(id);
    if (!dataId) {
      const err = new Error('No se encotro la multa');
      err.statusCode = 404;
      throw err;
    }

    dataId.estado = !dataId.estado;

    await dataId.save();

    return;
  }

  static async AsignarMulta(id, payload) {
    return sequelize.transaction(async (t) => {
      const { multa_id } = payload;
      const accionSearch = await accionModel.findByPk(id, { transaction: t });
      if (!accionSearch) {
        const err = new Error('No se encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      const multaSearch = await multaModel.findByPk(multa_id, {
        transaction: t,
      });
      if (!multaSearch) {
        const err = new Error('No se encontro la multa');
        err.statusCode = 404;
        throw err;
      }

      const periodoAcutal = await validaciones.ObtenerPeriodoActivo({
        transaction: t,
      });
      const cobroCreated = await cobroModel.create(
        {
          socio_id: accionSearch.socio_id,
          accion_id: accionSearch.id,
          periodo_id: periodoAcutal.id,
          tipo_cobro: 'MULTA',
          concepto: multaSearch.nombre_multa,
          descripcion: `Cobro de multa a la accion ${accionSearch.codigo_interno}`,
          monto_total: multaSearch.precio,
          saldo: multaSearch.precio,
        },
        { transaction: t },
      );

      await cobroMultaModel.create(
        {
          cobro_id: cobroCreated.id,
          multa_id: multa_id,
          multa_snapshot: multaSearch.nombre_multa,
          precio: multaSearch.precio,
        },
        { transaction: t },
      );

      return cobroCreated;
    });
  }
}
