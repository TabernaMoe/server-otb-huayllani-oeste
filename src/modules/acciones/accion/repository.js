import { col, fn } from 'sequelize';
import { accionModel } from '../../../models/accion/accion.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { tarifaModel } from '../../../models/tarifa/tarifa.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { detalleAccionModel } from '../../../models/accion/detalleAccion.model.js';

export class AccionRepository {
  static async getAll({ tipo_servicio }) {
    const data = await accionModel.findAll({
      attributes: [
        'id',
        'codigo_interno',
        'estado',
        'socio_id',
        [col('socioAccion.ci_socio'), 'ci_socio'],
        [
          fn(
            'concat_ws',
            ' ',
            col('socioAccion.nombres'),
            col('socioAccion.primer_apellido'),
            col('socioAccion.segundo_apellido'),
          ),
          'nombre_socio',
        ],
        [col('tarifaAccion.nombre_tarifa'), 'nombre_tarifa'],
        [col('calleAccion.nombre_calle'), 'nombre_calle'],
      ],
      include: [
        {
          model: socioModel,
          as: 'socioAccion',
          attributes: [],
        },
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
        {
          model: detalleAccionModel,
          as: 'detallesAccion',
          through: {
            attributes: [],
          },
        },
      ],
      where: {
        tipo_servicio,
      },
    });
    return data;
  }
  static async getById({ id, transaction = null }) {
    const data = await accionModel.findByPk(id, { transaction, raw: true });
    return !data ? null : data;
  }
  static async getSelectByServicio({ search, tipo_servicio }) {
    const filtros = {};

    // Filtrar por tipo de servicio
    if (!tipo_servicio) {
      return [];
    }

    // Nombre completo del socio
    const nombreCompleto = fn(
      'CONCAT_WS',
      ' ',
      col('socioAccion.nombres'),
      col('socioAccion.primer_apellido'),
      col('socioAccion.segundo_apellido'),
    );

    // Código interno + nombre completo
    const labelCompleto = fn(
      'CONCAT_WS',
      ' - ',
      col('codigo_interno'),
      nombreCompleto,
    );

    // Buscar por código interno o nombre completo
    if (search?.trim()) {
      const busqueda = `%${search.trim()}%`;

      filtros[Op.or] = [
        {
          codigo_interno: {
            [Op.iLike]: busqueda,
          },
        },
        whereSequelize(nombreCompleto, {
          [Op.iLike]: busqueda,
        }),
      ];
    }

    const data = await accionModel.findAll({
      attributes: [['id', 'value'], 'codigo_interno', [labelCompleto, 'label']],
      include: [
        {
          model: socioModel,
          as: 'socioAccion',
          attributes: [],
        },
      ],
      where: filtros,
      limit: 10,
      order: [['codigo_interno', 'ASC']],
      subQuery: false,
      raw: true,
    });

    return [
      {
        value: 0,
        codigo_interno: null,
        label: 'TODOS',
      },
      ...data,
    ];
  }
  static async getByIdByTipoServicio({
    id,
    tipo_servicio,
    transaction = null,
  }) {
    const data = await accionModel.findOne({
      where: {
        id,
        tipo_servicio,
      },
      transaction,
      raw: true,
    });
    return !data ? null : data;
  }
}
