import bcrypt from 'bcrypt';

import { PortalSocioRepository as repository } from './portalSocio.repository.js';
import {
  mapAccion,
  mapCobroAgua,
  mapCobroGeneral,
  mapLectura,
  mapReciboAgua,
  mapReciboGeneral,
  toNumber,
} from './portalSocio.mappers.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sortByDateDesc(items, field) {
  return [...items].sort(
    (a, b) => new Date(b[field]).getTime() - new Date(a[field]).getTime(),
  );
}

export class PortalSocioServices {
  static async getPerfil(socioId) {
    const socio = await repository.findSocioPerfilById(socioId);
    if (!socio) throw createHttpError(404, 'Socio no encontrado');
    return socio;
  }

  static async updatePerfil(socioId, payload) {
    const socio = await repository.findSocioById(socioId);
    if (!socio) throw createHttpError(404, 'Socio no encontrado');

    await socio.update({
      numero_celular: payload.numero_celular,
      direccion: payload.direccion,
    });

    return this.getPerfil(socioId);
  }

  static async getAcciones(socioId) {
    const rows = await repository.findAccionesBySocio(socioId);
    return rows.map(mapAccion);
  }

  static async getLecturas(socioId, accionId = null) {
    const rows = await repository.findLecturas(socioId, accionId);
    return rows.map(mapLectura);
  }

  static async getCobros(socioId, accionId = null) {
    const [generales, agua] = await Promise.all([
      repository.findCobrosGenerales(socioId, accionId),
      repository.findCobrosAgua(socioId, accionId),
    ]);

    return sortByDateDesc(
      [...generales.map(mapCobroGeneral), ...agua.map(mapCobroAgua)],
      'fecha_emision',
    );
  }

  static async getRecibos(socioId, accionId = null) {
    const [generales, agua] = await Promise.all([
      repository.findRecibosGenerales(socioId, accionId),
      repository.findRecibosAgua(socioId, accionId),
    ]);

    return sortByDateDesc(
      [
        ...generales.map((recibo) => mapReciboGeneral(recibo, accionId)),
        ...agua.map(mapReciboAgua),
      ],
      'fecha_emision',
    );
  }

  static async getResumen(socioId) {
    const [acciones, cobros, lecturas, recibos] = await Promise.all([
      this.getAcciones(socioId),
      this.getCobros(socioId),
      this.getLecturas(socioId),
      this.getRecibos(socioId),
    ]);

    const accionesActivas = acciones.filter((a) => a.estado === 'ACTIVO').length;
    const cobrosPendientes = cobros.filter((c) =>
      ['PENDIENTE', 'PARCIAL'].includes(c.estado),
    );
    const deudaPendiente = cobrosPendientes.reduce(
      (total, item) => total + toNumber(item.saldo),
      0,
    );

    const ultimaLectura = lecturas[0];
    const ultimoPago = recibos[0];

    return {
      acciones_activas: accionesActivas,
      total_acciones: acciones.length,
      deuda_pendiente: deudaPendiente,
      cobros_pendientes_count: cobrosPendientes.length,
      recibos_count: recibos.length,
      ultima_lectura: ultimaLectura
        ? `${ultimaLectura.lectura_actual} m³ - ${ultimaLectura.mes ?? ''}`.trim()
        : null,
      ultimo_pago: ultimoPago
        ? `Bs ${toNumber(ultimoPago.monto).toFixed(2)}`
        : null,
      proximos_cobros: cobrosPendientes.slice(0, 4),
    };
  }

  static async cambiarPassword(userId, payload) {
    const usuario = await repository.findUsuarioById(userId);
    if (!usuario) throw createHttpError(404, 'Usuario no encontrado');

    const isValid = await bcrypt.compare(
      payload.contrasenia_actual,
      usuario.contrasenia_usuario,
    );
    if (!isValid) throw createHttpError(400, 'Contraseña actual incorrecta');

    const passwordHash = await bcrypt.hash(payload.contrasenia_nueva, 12);

    await usuario.update({
      contrasenia_usuario: passwordHash,
      debe_camibiar_contrasenia: false,
    });
  }
}
