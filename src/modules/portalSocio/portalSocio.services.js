import bcrypt from 'bcrypt';
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

import {
  mapAccion,
  mapCobroAgua,
  mapCobroGeneral,
  mapLectura,
  toNumber,
} from './portalSocio.mappers.js';

/* =========================================================
   HELPERS
========================================================= */

function buildAccionWhere(socioId, accionId) {
  const where = {
    socio_id: socioId,
  };

  if (accionId) {
    where.id = accionId;
  }

  return where;
}

function buildCobroWhere(socioId, accionId) {
  const where = {
    socio_id: socioId,
    estado: {
      [Op.ne]: 'ANULADO',
    },
  };

  if (accionId) {
    where.accion_id = accionId;
  }

  return where;
}

function buildReciboCobroWhere(socioId, accionId) {
  const where = {
    socio_id: socioId,
  };

  if (accionId) {
    where.accion_id = accionId;
  }

  return where;
}

/* =========================================================
   SERVICE
========================================================= */

export class PortalSocioServices {
  /* =======================================================
     PERFIL
  ======================================================= */

  static async getPerfil(socioId) {
    const socio = await socioModel.findByPk(socioId, {
      attributes: {
        exclude: ['user_id', 'createdAt', 'updatedAt'],
      },

      raw: true,
    });

    if (!socio) {
      const error = new Error('Socio no encontrado');

      error.statusCode = 404;

      throw error;
    }

    return socio;
  }

  /* =======================================================
     ACCIONES DEL SOCIO
  ======================================================= */

  static async getAcciones(socioId) {
    const rows = await accionModel.findAll({
      where: {
        socio_id: socioId,
      },

      attributes: [
        'id',
        'codigo_interno',
        'nro_medidor',
        'direccion',
        'estado',
      ],

      include: [
        {
          model: calleRamalModel,

          as: 'calleAccion',

          attributes: ['nombre_calle'],
        },

        {
          model: tarifaModel,

          as: 'tarifaAccion',

          attributes: ['nombre_tarifa'],
        },

        {
          model: detalleAccionModel,

          as: 'detallesAccion',

          attributes: ['id', 'nombre_accion', 'precio_accion', 'tipo_cobro'],

          through: {
            attributes: [],
          },

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

    return rows.map(mapAccion);
  }

  /* =======================================================
     LECTURAS

     Todas:
     getLecturas(socioId)

     Por acción:
     getLecturas(socioId, accionId)
  ======================================================= */

  static async getLecturas(socioId, accionId = null) {
    const rows = await lecturaAguaModel.findAll({
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

          include: [
            {
              model: gestionModel,

              as: 'gestion',

              attributes: ['anio'],
            },
          ],
        },
      ],

      order: [['id', 'DESC']],
    });

    return rows.map(mapLectura);
  }

  /* =======================================================
     COBROS

     Todos:
     getCobros(socioId)

     Por acción:
     getCobros(socioId, accionId)
  ======================================================= */

  static async getCobros(socioId, accionId = null) {
    const where = buildCobroWhere(socioId, accionId);

    const [generales, agua] = await Promise.all([
      /* ---------------------------
         COBROS GENERALES
      --------------------------- */

      cobroModel.findAll({
        where,

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
      }),

      /* ---------------------------
         COBROS AGUA
      --------------------------- */

      cobroAguaModel.findAll({
        where,

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
      }),
    ]);

    return [...generales.map(mapCobroGeneral), ...agua.map(mapCobroAgua)].sort(
      (a, b) =>
        new Date(b.fecha_emision).getTime() -
        new Date(a.fecha_emision).getTime(),
    );
  }

  /* =======================================================
     RECIBOS GENERALES POR ACCIÓN
  ======================================================= */

  static async getRecibosGenerales(socioId, accionId = null) {
    const recibos = await reciboModel.findAll({
      where: {
        [Op.or]: [
          {
            estado: true,
          },

          {
            estado: null,
          },
        ],
      },

      attributes: ['id', 'numero_recibo', 'fecha_emision'],

      include: [
        {
          model: pagoModel,

          as: 'pago',

          attributes: ['id', 'monto_pagado'],

          required: true,

          include: [
            {
              model: cobroModel,

              as: 'cobrosRecibo',

              attributes: ['id', 'accion_id', 'concepto', 'tipo_cobro'],

              where: buildReciboCobroWhere(socioId, accionId),

              required: true,

              through: {
                attributes: ['monto'],
              },
            },
          ],
        },
      ],

      order: [['fecha_emision', 'DESC']],
    });

    return recibos.map((recibo) => {
      const cobros = recibo.pago?.cobrosRecibo ?? [];

      /*
        Un pago general puede tener varios
        detalles de cobro.

        Sumamos solamente los detalles que
        pertenecen a la acción filtrada.
      */

      const monto = cobros.reduce((total, cobro) => {
        const montoDetalle = cobro.pago_detalle?.monto;

        return total + toNumber(montoDetalle);
      }, 0);

      const conceptos = [
        ...new Set(cobros.map((cobro) => cobro.concepto).filter(Boolean)),
      ];

      return {
        id: recibo.id,

        numero_recibo: recibo.numero_recibo,

        fecha_emision: recibo.fecha_emision,

        monto: monto || toNumber(recibo.pago?.monto_pagado),

        origen: 'GENERAL',

        concepto: conceptos.join(', '),

        accion_id: accionId ?? cobros[0]?.accion_id ?? null,
      };
    });
  }

  /* =======================================================
     RECIBOS DE AGUA POR ACCIÓN
  ======================================================= */

  static async getRecibosAgua(socioId, accionId = null) {
    const recibos = await reciboAguaModel.findAll({
      attributes: ['id', 'numero_recibo', 'fecha_emision'],

      include: [
        {
          model: pagoAguaModel,

          as: 'reciboAguaRecibo',

          attributes: ['id', 'monto', 'cobro_agua_id'],

          required: true,

          include: [
            {
              model: cobroAguaModel,

              as: 'pagoAgua',

              attributes: ['id', 'accion_id', 'concepto'],

              where: buildReciboCobroWhere(socioId, accionId),

              required: true,
            },
          ],
        },
      ],

      order: [['fecha_emision', 'DESC']],
    });

    return recibos.map((recibo) => {
      const pago = recibo.reciboAguaRecibo;

      const cobro = pago?.pagoAgua;

      return {
        id: recibo.id,

        numero_recibo: recibo.numero_recibo,

        fecha_emision: recibo.fecha_emision,

        monto: toNumber(pago?.monto),

        origen: 'AGUA',

        concepto: cobro?.concepto ?? 'Pago de agua',

        accion_id: cobro?.accion_id ?? null,
      };
    });
  }

  /* =======================================================
     TODOS LOS RECIBOS

     Todos:
     getRecibos(socioId)

     Por acción:
     getRecibos(socioId, accionId)
  ======================================================= */

  static async getRecibos(socioId, accionId = null) {
    const [recibosGenerales, recibosAgua] = await Promise.all([
      this.getRecibosGenerales(socioId, accionId),

      this.getRecibosAgua(socioId, accionId),
    ]);

    return [...recibosGenerales, ...recibosAgua].sort(
      (a, b) =>
        new Date(b.fecha_emision).getTime() -
        new Date(a.fecha_emision).getTime(),
    );
  }

  /* =======================================================
     RESUMEN DEL DASHBOARD
  ======================================================= */

  static async getResumen(socioId) {
    const [accionesActivas, cobros, lecturas, recibos] = await Promise.all([
      accionModel.count({
        where: {
          socio_id: socioId,
          estado: 'ACTIVO',
        },
      }),

      this.getCobros(socioId),

      this.getLecturas(socioId),

      this.getRecibos(socioId),
    ]);

    const deudaPendiente = cobros
      .filter((item) => ['PENDIENTE', 'PARCIAL'].includes(item.estado))
      .reduce(
        (total, item) => total + toNumber(item.saldo),

        0,
      );

    const ultimaLectura = lecturas[0];

    const ultimoPago = recibos[0];

    return {
      acciones_activas: accionesActivas,

      deuda_pendiente: deudaPendiente,

      ultima_lectura: ultimaLectura
        ? `${ultimaLectura.lectura_actual} m³ - ${ultimaLectura.mes ?? ''}`.trim()
        : null,

      ultimo_pago: ultimoPago
        ? `Bs ${toNumber(ultimoPago.monto).toFixed(2)}`
        : null,
    };
  }

  /* =======================================================
     CAMBIAR CONTRASEÑA
  ======================================================= */

  static async cambiarPassword(userId, payload) {
    const usuario = await usuarioModel.findByPk(userId);

    if (!usuario) {
      const error = new Error('Usuario no encontrado');

      error.statusCode = 404;

      throw error;
    }

    const valid = await bcrypt.compare(
      payload.contrasenia_actual,
      usuario.contrasenia_usuario,
    );

    if (!valid) {
      const error = new Error('Contraseña actual incorrecta');

      error.statusCode = 400;

      throw error;
    }

    const passwordHash = await bcrypt.hash(payload.contrasenia_nueva, 12);

    await usuario.update({
      contrasenia_usuario: passwordHash,

      debe_camibiar_contrasenia: false,
    });
  }
}
