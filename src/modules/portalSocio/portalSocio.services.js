import bcrypt from 'bcrypt';
import { Op, QueryTypes } from 'sequelize';

import { sequelize } from '../../config/database.js';
import { accionModel } from '../../models/accion/accion.model.js';
import { usuarioModel } from '../../models/auth/usuario.model.js';
import { calleRamalModel } from '../../models/calleRamal.model.js';
import { cobroAguaModel } from '../../models/cobroAgua/cobroAgua.model.js';
import { cobroModel } from '../../models/cobros/cobro.model.js';
import { gestionModel } from '../../models/gestiones/gestion.model.js';
import { periodoModel } from '../../models/gestiones/periodo.model.js';
import { lecturaAguaModel } from '../../models/lecturasAgua/lecturasAgua.model.js';
import { socioModel } from '../../models/socio.model.js';
import { tarifaModel } from '../../models/tarifa/tarifa.model.js';

function toNumber(value) {
  return Number(value ?? 0);
}

export class PortalSocioServices {
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

  static async getAcciones(socioId) {
    const rows = await accionModel.findAll({
      where: { socio_id: socioId },
      attributes: ['id', 'codigo_interno', 'nro_medidor', 'direccion', 'estado'],
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
      ],
      order: [['id', 'DESC']],
    });

    return rows.map((row) => ({
      id: row.id,
      codigo_interno: row.codigo_interno,
      tipo: 'AGUA',
      nro_medidor: row.nro_medidor,
      calle: row.calleAccion?.nombre_calle ?? '-',
      tarifa: row.tarifaAccion?.nombre_tarifa ?? '-',
      direccion: row.direccion,
      estado: row.estado,
    }));
  }

  static async getLecturas(socioId) {
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
          where: { socio_id: socioId },
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

    return rows.map((row) => ({
      id: row.id,
      accion_id: row.lecturaAccion?.id,
      codigo_interno: row.lecturaAccion?.codigo_interno,
      nro_medidor: row.lecturaAccion?.nro_medidor,
      gestion: row.lecturaPeriodo?.gestion?.anio ?? null,
      mes: row.lecturaPeriodo?.mes ?? row.periodo,
      lectura_anterior: row.lectura_anterior,
      lectura_actual: row.lectura_actual,
      consumo_m3: row.consumo_m3,
      monto: toNumber(row.precio) + toNumber(row.mora),
      fecha: row.createdAt,
    }));
  }

  static async getCobros(socioId) {
    const [generales, agua] = await Promise.all([
      cobroModel.findAll({
        where: { socio_id: socioId, estado: { [Op.ne]: 'ANULADO' } },
        attributes: [
          'id',
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
      cobroAguaModel.findAll({
        where: { socio_id: socioId, estado: { [Op.ne]: 'ANULADO' } },
        attributes: [
          'id',
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

    return [
      ...generales.map((item) => ({
        ...item,
        origen: 'GENERAL',
        monto: toNumber(item.saldo),
      })),
      ...agua.map((item) => ({
        ...item,
        tipo_cobro: 'AGUA',
        origen: 'AGUA',
        monto: toNumber(item.saldo),
      })),
    ].sort(
      (a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime(),
    );
  }

  static async getRecibos(socioId) {
    const [recibosGenerales, recibosAgua] = await Promise.all([
      sequelize.query(
        `SELECT DISTINCT
           r.id,
           r.numero_recibo,
           r.fecha_emision,
           p.monto_pagado AS monto,
           'GENERAL' AS origen,
           STRING_AGG(DISTINCT c.concepto, ', ') AS concepto
         FROM recibos r
         INNER JOIN pagos p ON p.id = r.pago_id
         INNER JOIN pago_detalle pd ON pd.pago_id = p.id
         INNER JOIN cobros c ON c.id = pd.cobro_id
         WHERE c.socio_id = :socioId
           AND COALESCE(r.estado, true) = true
         GROUP BY r.id, r.numero_recibo, r.fecha_emision, p.monto_pagado
         ORDER BY r.fecha_emision DESC`,
        {
          replacements: { socioId },
          type: QueryTypes.SELECT,
        },
      ),
      sequelize.query(
        `SELECT DISTINCT
           r.id,
           r.numero_recibo,
           r.fecha_emision,
           p.monto AS monto,
           'AGUA' AS origen,
           c.concepto
         FROM recibo_agua r
         INNER JOIN pago_agua p ON p.id = r.pago_agua_id
         INNER JOIN cobro_agua c ON c.id = p.cobro_agua_id
         WHERE c.socio_id = :socioId
         ORDER BY r.fecha_emision DESC`,
        {
          replacements: { socioId },
          type: QueryTypes.SELECT,
        },
      ),
    ]);

    return [...recibosGenerales, ...recibosAgua].sort(
      (a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime(),
    );
  }

  static async getResumen(socioId) {
    const [accionesActivas, cobros, lecturas, recibos] = await Promise.all([
      accionModel.count({ where: { socio_id: socioId, estado: 'ACTIVO' } }),
      this.getCobros(socioId),
      this.getLecturas(socioId),
      this.getRecibos(socioId),
    ]);

    const deudaPendiente = cobros
      .filter((item) => ['PENDIENTE', 'PARCIAL'].includes(item.estado))
      .reduce((total, item) => total + toNumber(item.saldo), 0);

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
