import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

/**
 * Recorre el árbol de routers de Express 5 usando el propio `layer.match(...)`
 * para verificar con exactitud que un método HTTP y una ruta concreta estén montados.
 */
function hasMountedRoute(stack, method, path) {
  if (!Array.isArray(stack)) return false;
  const normalizedMethod = method.toLowerCase();

  for (const layer of stack) {
    if (layer.route) {
      if (layer.match(path) && layer.route.methods[normalizedMethod]) {
        return true;
      }
      continue;
    }

    if (layer.handle?.stack) {
      if (layer.match(path)) {
        const matchedPrefix = layer.path || '';
        const remaining =
          matchedPrefix && matchedPrefix !== '/'
            ? path.slice(matchedPrefix.length) || '/'
            : path;
        if (hasMountedRoute(layer.handle.stack, method, remaining)) {
          return true;
        }
      }
    }
  }

  return false;
}

const toConcretePath = (pattern) =>
  pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, name) =>
    name === 'fecha' ? '20261123' : '1',
  );

const EXPECTED_BY_MODULE = {
  health: ['GET /health'],
  login: ['POST /api/login', 'GET /api/login/me', 'PATCH /api/login'],
  auth_roles: [
    'GET /api/admin/auth/roles',
    'GET /api/admin/auth/roles/permisos',
    'GET /api/admin/auth/roles/:id',
    'POST /api/admin/auth/roles',
    'PATCH /api/admin/auth/roles/:id',
  ],
  auth_usuarios: [
    'GET /api/admin/auth/usuarios',
    'GET /api/admin/auth/usuarios/:id',
    'POST /api/admin/auth/usuarios',
    'PATCH /api/admin/auth/usuarios/:id',
    'PATCH /api/admin/auth/usuarios/toggle-status/:id',
  ],
  personaAdmin: [
    'GET /api/admin/persona-admin',
    'GET /api/admin/persona-admin/rol',
    'GET /api/admin/persona-admin/:id',
    'POST /api/admin/persona-admin',
    'PATCH /api/admin/persona-admin/:id',
    'PATCH /api/admin/persona-admin/cambiar-estado/:id',
  ],
  calleRamal: [
    'GET /api/admin/calle',
    'GET /api/admin/calle/:id',
    'POST /api/admin/calle',
    'PATCH /api/admin/calle/:id',
    'PATCH /api/admin/calle/cambiar-estado/:id',
  ],
  tarifa: [
    'GET /api/admin/tarifa',
    'GET /api/admin/tarifa/:id',
    'POST /api/admin/tarifa',
    'PATCH /api/admin/tarifa/:id',
    'PATCH /api/admin/tarifa/cambiar-estado/:id',
  ],
  socios: [
    'GET /api/admin/socio',
    'GET /api/admin/socio/:id',
    'GET /api/admin/socio/detalle/:id',
    'POST /api/admin/socio',
    'PATCH /api/admin/socio/:id',
    'PATCH /api/admin/socio/cambiar-estado/:id',
  ],
  acciones_agua_detalle: [
    'GET /api/admin/acciones/agua/detalle',
    'GET /api/admin/acciones/agua/detalle/tipos-accion',
    'GET /api/admin/acciones/agua/detalle/:id',
    'POST /api/admin/acciones/agua/detalle',
    'PATCH /api/admin/acciones/agua/detalle/:id',
    'PATCH /api/admin/acciones/agua/detalle/change-status/:id',
  ],
  acciones_agua_tipo: [
    'GET /api/admin/acciones/agua/tipo-accion',
    'POST /api/admin/acciones/agua/tipo-accion',
    'PUT /api/admin/acciones/agua/tipo-accion/:id',
  ],
  acciones_agua: [
    'GET /api/admin/acciones/agua',
    'GET /api/admin/acciones/agua/socios',
    'GET /api/admin/acciones/agua/tarifa',
    'GET /api/admin/acciones/agua/calle',
    'GET /api/admin/acciones/agua/tipos-accion',
    'GET /api/admin/acciones/agua/detalle-accion/:id',
    'GET /api/admin/acciones/agua/:id',
    'POST /api/admin/acciones/agua',
    'POST /api/admin/acciones/agua/cambiar-nombre',
    'PATCH /api/admin/acciones/agua/:id',
  ],
  acciones_alcantarillado_detalle: [
    'GET /api/admin/acciones/alcantarillado/detalle',
    'GET /api/admin/acciones/alcantarillado/detalle/:id',
    'POST /api/admin/acciones/alcantarillado/detalle',
    'PATCH /api/admin/acciones/alcantarillado/detalle/:id',
    'PATCH /api/admin/acciones/alcantarillado/detalle/change-status/:id',
  ],
  acciones_alcantarillado: [
    'GET /api/admin/acciones/alcantarillado',
    'GET /api/admin/acciones/alcantarillado/socio',
    'GET /api/admin/acciones/alcantarillado/calle',
    'GET /api/admin/acciones/alcantarillado/detalles-accion',
    'GET /api/admin/acciones/alcantarillado/:id',
    'POST /api/admin/acciones/alcantarillado',
    'POST /api/admin/acciones/alcantarillado/cambiar-nombre',
    'PATCH /api/admin/acciones/alcantarillado/:id',
  ],
  accion_legacy: [
    'GET /api/admin/accion/tipo-accion',
    'POST /api/admin/accion/tipo-accion',
    'PATCH /api/admin/accion/tipo-accion/:id',
    'GET /api/admin/accion/detalle',
    'GET /api/admin/accion/detalle/tipos-accion',
    'GET /api/admin/accion/detalle/:id',
    'POST /api/admin/accion/detalle',
    'PATCH /api/admin/accion/detalle/:id',
    'PATCH /api/admin/accion/detalle/cambiar-estado/:id',
    'GET /api/admin/accion',
    'GET /api/admin/accion/socios',
    'GET /api/admin/accion/tarifa-agua',
    'GET /api/admin/accion/tipos-accion',
    'GET /api/admin/accion/caratula/:id',
    'GET /api/admin/accion/detalle-accion/:id',
    'GET /api/admin/accion/:id',
    'POST /api/admin/accion',
    'PATCH /api/admin/accion/:id',
    'PATCH /api/admin/accion/camibiar-estado/:id',
    'PATCH /api/admin/accion/cambiar-nombre/:id',
  ],
  gestiones_periodos: [
    'GET /api/admin/gestion',
    'GET /api/admin/gestion/:id',
    'POST /api/admin/gestion',
    'GET /api/admin/gestion/periodo',
    'GET /api/admin/gestion/periodo/select',
    'PATCH /api/admin/gestion/periodo/cerrar/:id',
  ],
  cobros: [
    'GET /api/admin/cobro',
    'GET /api/admin/cobro/historial',
    'GET /api/admin/cobro/acciones',
    'GET /api/admin/cobro/multas',
    'GET /api/admin/cobro/acciones-pasivas',
    'GET /api/admin/cobro/:id',
    'GET /api/admin/cobro/accion-historial/:id',
    'POST /api/admin/cobro',
    'POST /api/admin/cobro/multas/:id',
    'POST /api/admin/cobro/crear-cobro',
  ],
  lecturas: [
    'GET /api/admin/lectura',
    'GET /api/admin/lectura/acciones',
    'GET /api/admin/lectura/acciones-con-mora',
    'GET /api/admin/lectura/historial/:id',
    'GET /api/admin/lectura/:id',
    'POST /api/admin/lectura/:id',
    'PATCH /api/admin/lectura/:id',
    'PATCH /api/admin/lectura/cambio/:id',
    'PATCH /api/admin/lectura/modificar-m3/:id',
    'PATCH /api/admin/lectura/modificar-mora/:id',
    'PATCH /api/admin/lectura/update-only-lectura/:id',
  ],
  cobrosAgua: [
    'GET /api/admin/pago-agua',
    'GET /api/admin/pago-agua/:id',
    'GET /api/admin/pago-agua/historial/:id',
    'PATCH /api/admin/pago-agua/pagar/:id',
  ],
  inventario: [
    'GET /api/admin/inventario',
    'GET /api/admin/inventario/restar/:id',
    'GET /api/admin/inventario/sumar/:id',
    'POST /api/admin/inventario',
    'PATCH /api/admin/inventario/:id',
  ],
  asambleas: [
    'GET /api/admin/asamblea',
    'GET /api/admin/asamblea/reporte/:id',
    'GET /api/admin/asamblea/acciones/:id',
    'GET /api/admin/asamblea/:id',
    'POST /api/admin/asamblea',
    'PATCH /api/admin/asamblea/:id',
    'PATCH /api/admin/asamblea/accion/:id',
  ],
  multas: [
    'GET /api/admin/multa',
    'POST /api/admin/multa',
    'PATCH /api/admin/multa/:id',
    'PATCH /api/admin/multa/cambiar-estado/:id',
  ],
  alcantarillado_legacy: [
    'GET /api/admin/alcantarillado/accion',
    'GET /api/admin/alcantarillado/accion/socio',
    'GET /api/admin/alcantarillado/accion/calle',
    'GET /api/admin/alcantarillado/accion/detalle',
    'GET /api/admin/alcantarillado/accion/:id',
    'POST /api/admin/alcantarillado/accion',
    'PATCH /api/admin/alcantarillado/accion/:id',
    'PATCH /api/admin/alcantarillado/accion/cambiar-estado/:id',
    'GET /api/admin/alcantarillado/detalle',
    'POST /api/admin/alcantarillado/detalle',
    'PATCH /api/admin/alcantarillado/detalle/:id',
    'PATCH /api/admin/alcantarillado/detalle/cambiar-estado/:id',
    'GET /api/admin/alcantarillado/cobros/socios',
    'GET /api/admin/alcantarillado/cobros/acciones',
    'GET /api/admin/alcantarillado/cobros/pendientes-socio/:id',
    'GET /api/admin/alcantarillado/cobros/pendientes-accion/:id',
    'GET /api/admin/alcantarillado/cobros/historial-accion/:id',
    'GET /api/admin/alcantarillado/cobros/historial-socio/:id',
    'POST /api/admin/alcantarillado/cobros/pagar',
  ],
  cambioNombre: [
    'GET /api/admin/cambio-nombre',
    'GET /api/admin/cambio-nombre/acciones',
    'GET /api/admin/cambio-nombre/socios',
    'GET /api/admin/cambio-nombre/:id',
    'POST /api/admin/cambio-nombre',
  ],
  reciboUniversal: [
    'GET /api/admin/recibo-universal',
    'GET /api/admin/recibo-universal/accion',
    'GET /api/admin/recibo-universal/:id',
    'POST /api/admin/recibo-universal',
    'PATCH /api/admin/recibo-universal/:id',
  ],
  egresos: [
    'GET /api/admin/egresos/categoria-gastos',
    'POST /api/admin/egresos/categoria-gastos',
    'PATCH /api/admin/egresos/categoria-gastos/:id',
    'GET /api/admin/egresos',
    'GET /api/admin/egresos/beneficiarios',
    'POST /api/admin/egresos',
    'PATCH /api/admin/egresos/:id',
    'PATCH /api/admin/egresos/cambiar-estado/:id',
  ],
  cobrosGenerales: [
    'GET /api/admin/cobros-generales/recibos',
    'GET /api/admin/cobros-generales/recibos/seleccion-socios',
    'GET /api/admin/cobros-generales/recibos/socio/:id',
    'GET /api/admin/cobros-generales/recibos/accion/:id',
    'POST /api/admin/cobros-generales/recibos/seleccion-accion',
  ],
  reportes: [
    'GET /api/admin/reportes/cobro',
    'GET /api/admin/reportes/cobro/acciones',
    'GET /api/admin/reportes/cobro/socios',
    'POST /api/admin/reportes/cobro/fechas',
    'GET /api/admin/reportes/cobro/accion/:id',
    'POST /api/admin/reportes/cobro/accion/fechas/:id',
    'GET /api/admin/reportes/cobro/socio/:id',
    'POST /api/admin/reportes/cobro/socio/fechas/:id',
    'GET /api/admin/reportes/recibo',
    'GET /api/admin/reportes/recibo/acciones',
    'GET /api/admin/reportes/recibo/socios',
    'POST /api/admin/reportes/recibo/fechas',
    'GET /api/admin/reportes/recibo/accion/:id',
    'POST /api/admin/reportes/recibo/accion/fechas/:id',
    'GET /api/admin/reportes/recibo/socio/:id',
    'POST /api/admin/reportes/recibo/socio/fechas/:id',
  ],
  portalSocio: [
    'GET /api/socio/me',
    'PATCH /api/socio/me',
    'GET /api/socio/me/resumen',
    'GET /api/socio/me/acciones',
    'GET /api/socio/me/lecturas',
    'GET /api/socio/me/cobros',
    'GET /api/socio/me/recibos',
    'PATCH /api/socio/me/password',
    'GET /api/cliente/me',
    'PATCH /api/cliente/me',
    'GET /api/cliente/me/resumen',
    'GET /api/cliente/me/acciones',
    'GET /api/cliente/me/lecturas',
    'GET /api/cliente/me/cobros',
    'GET /api/cliente/me/recibos',
    'PATCH /api/cliente/me/password',
  ],
  pagoQr: [
    'POST /api/pagos-qr',
    'GET /api/pagos-qr',
    'POST /api/pagos-qr/conciliar/:fecha',
    'GET /api/pagos-qr/:id/status',
    'GET /api/pagos-qr/:id',
  ],
  pruebapdf: [
    'GET /api/prueba/recibo',
    'GET /api/prueba/caratula',
    'GET /api/prueba/reunion',
  ],
};

describe('Backend — Inventario completo de endpoints montados en Express', () => {
  const rootStack = app.router?.stack ?? app._router?.stack;

  for (const [moduleName, endpoints] of Object.entries(EXPECTED_BY_MODULE)) {
    it(`Módulo ${moduleName}: expone todos sus endpoints (${endpoints.length})`, () => {
      const missing = endpoints.filter((ep) => {
        const [method, pattern] = ep.split(' ');
        return !hasMountedRoute(rootStack, method, toConcretePath(pattern));
      });
      assert.deepEqual(
        missing,
        [],
        `Faltan endpoints en ${moduleName}: ${missing.join(', ')}`,
      );
    });
  }
});
