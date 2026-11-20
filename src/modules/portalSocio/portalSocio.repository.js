import { Op } from 'sequelize';

import { accionModel } from '../../models/accion/accion.model.js';
import { detalleAccionModel } from '../../models/accion/detalleAccion.model.js';
import { tipoAccionModel } from '../../models/accion/tipoAccion.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';
import { cobroAguaModel } from '../../models/cobroAgua/cobroAgua.model.js';
import { pagoAguaModel } from '../../models/cobroAgua/pagoAgua.model.js';
import { reciboAguaModel } from '../../models/cobroAgua/recibo.mode.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { pagoModel } from '../../models/cobros/pago.model.js';
import { reciboModel } from '../../models/cobros/recibo.model.js';
import { gestionModel } from '../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';
import { lecturaAguaModel } from '../../models/lecturasAgua/lecturasAgua.model.js';
import { socioModel } from '../../models/socio.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';

function buildAccionWhere(socioId, accionId) {
  return accionId ? { socio_id: socioId, id: accionId } : { socio_id: socioId };
}

function buildCobroWhere(socioId, accionId) {
  const where = { socio_id: socioId, estado: { [Op.ne]: 'ANULADO' } };
  if (accionId) where.accion_id = accionId;
  return where;
}

function buildReciboCobroWhere(socioId, accionId) {
  return accionId
    ? { socio_id: socioId, accion_id: accionId }
    : { socio_id: socioId };
}

export class PortalSocioRepository {
  static findSocioPerfilById(socioId) {
    return socioModel.findByPk(socioId, {
      attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] },
      raw: true,
    });
  }

  static findSocioById(socioId) {
    return socioModel.findByPk(socioId);
  }

  static findUsuarioById(userId) {
    return usuarioModel.findByPk(userId);
  }

  static findAccionesBySocio(socioId) {
    return accionModel.findAll({
      where: { socio_id: socioId },
      attributes: [
        'id',
        'codigo_interno',
        'tipo_servicio',
        'nro_medidor',
        'direccion',
        'observacion',
        'estado',
      ],
      include: [
        { model: calleRamalModel, as: 'calleAccion', attributes: ['nombre_calle'] },
        { model: tarifaModel, as: 'tarifaAccion', attributes: ['nombre_tarifa'] },
        {
          model: detalleAccionModel,
          as: 'detallesAccion',
          attributes: ['id', 'nombre_accion', 'precio_accion', 'tipo_cobro'],
          through: { attributes: [] },
          include: [
            {
              model: tipoAccionModel,
              as: 'tipoAccion',
              attributes: ['id', 'nombre_tipo_accion'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  static findLecturas(socioId, accionId = null) {
    return lecturaAguaModel.findAll({
      attributes: [
        'id',
        'lectura_anterior',
        'lectura_actual',
        'consumo_m3',
        'precio',
        'mora',
        'periodo',
        'createdAt',
      ],
      include: [
        {
          model: accionModel,
          as: 'lecturaAccion',
          where: buildAccionWhere(socioId, accionId),
          attributes: ['id', 'codigo_interno', 'nro_medidor'],
          required: true,
        },
        {
          model: periodoModel,
          as: 'lecturaPeriodo',
          attributes: ['mes'],
          include: [{ model: gestionModel, as: 'gestion', attributes: ['anio'] }],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  static findCobrosGenerales(socioId, accionId = null) {
    return cobroModel.findAll({
      where: buildCobroWhere(socioId, accionId),
      attributes: [
        'id',
        'accion_id',
        'concepto',
        'descripcion',
        'monto_total',
        'monto_pagado',
        'saldo',
        'estado',
        'fecha_emision',
        'tipo_cobro',
      ],
      order: [['fecha_emision', 'DESC']],
      raw: true,
    });
  }

  static findCobrosAgua(socioId, accionId = null) {
    return cobroAguaModel.findAll({
      where: buildCobroWhere(socioId, accionId),
      attributes: [
        'id',
        'accion_id',
        'concepto',
        'descripcion',
        'monto_total',
        'monto_pagado',
        'saldo',
        'estado',
        'fecha_emision',
      ],
      order: [['fecha_emision', 'DESC']],
      raw: true,
    });
  }

  static findRecibosGenerales(socioId, accionId = null) {
    return reciboModel.findAll({
      where: { [Op.or]: [{ estado: true }, { estado: null }] },
      attributes: ['id', 'numero_recibo', 'fecha_emision'],
      include: [
        {
          model: pagoModel,
          as: 'pago',
          attributes: ['id', 'monto_pagado', 'metodo_pago'],
          required: true,
          include: [
            {
              model: cobroModel,
              as: 'cobrosRecibo',
              attributes: ['id', 'accion_id', 'concepto', 'descripcion', 'tipo_cobro'],
              where: buildReciboCobroWhere(socioId, accionId),
              required: true,
              through: { attributes: ['monto'] },
              include: [
                {
                  model: accionModel,
                  as: 'accionCobro',
                  attributes: ['id', 'codigo_interno'],
                },
              ],
            },
          ],
        },
      ],
      order: [['fecha_emision', 'DESC']],
    });
  }

  static findRecibosAgua(socioId, accionId = null) {
    return reciboAguaModel.findAll({
      attributes: ['id', 'numero_recibo', 'fecha_emision'],
      include: [
        {
          model: pagoAguaModel,
          as: 'reciboAguaRecibo',
          attributes: ['id', 'monto', 'metodo_pago', 'cobro_agua_id'],
          required: true,
          include: [
            {
              model: cobroAguaModel,
              as: 'pagoAgua',
              attributes: ['id', 'accion_id', 'concepto', 'descripcion'],
              where: buildReciboCobroWhere(socioId, accionId),
              required: true,
              include: [
                {
                  model: accionModel,
                  as: 'accionCobroAgua',
                  attributes: ['id', 'codigo_interno'],
                },
              ],
            },
          ],
        },
      ],
      order: [['fecha_emision', 'DESC']],
    });
  }
}
