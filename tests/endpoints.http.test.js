import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough, Readable } from 'node:stream';
import http from 'node:http';
import { z } from 'zod';
import app from '../src/app.js';
import { sequelize } from '../src/config/database.js';
import { validateSchema } from '../src/middlewares/validateSchema.middlewares.js';
import { validateRequest } from '../src/middlewares/validateRequest.middlewares.js';
import { errorHandler } from '../src/middlewares/errorHandler.middlewares.js';
import { UpdateUseCase as UpdateAguaUseCase } from '../src/modules/acciones/accionAgua/accion/use-case/update.use-case.js';
import { AccionAguaRepository } from '../src/modules/acciones/accionAgua/accion/repository.js';
import { DetalleAccionRepository as DetalleAguaRepo } from '../src/modules/acciones/accionAgua/detalleAccion/repository.js';
import { AccionDetalleRepository as AccionDetalleAguaRepo } from '../src/modules/acciones/accionAgua/accionDetalle/repository.js';
import { CobroRepository } from '../src/modules/cobrosGenerales/cobro/repository.js';
import { CobroAccionRespository } from '../src/modules/cobrosGenerales/tipoCobro/CobroAccion.repository.js';
import { PeriodoRepository } from '../src/modules/gestiones/periodo/periodo.repository.js';

/**
 * Invoca la app Express en memoria sin abrir puertos TCP (rápido y determinista).
 */
function invokeApp(expressApp, { method = 'GET', url = '/', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const rawBody = body !== undefined ? JSON.stringify(body) : '';
    const req = Readable.from(rawBody ? [Buffer.from(rawBody)] : []);
    req.url = url;
    req.method = method;
    req.headers = {
      ...(rawBody
        ? {
            'content-type': 'application/json',
            'content-length': String(Buffer.byteLength(rawBody)),
          }
        : {}),
      ...headers,
    };
    req.socket = { remoteAddress: '127.0.0.1' };
    req.connection = req.socket;
    Object.setPrototypeOf(req, http.IncomingMessage.prototype);

    const chunks = [];
    const socket = new PassThrough();
    socket.remoteAddress = '127.0.0.1';
    req.socket = socket;
    req.connection = socket;

    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    const origWrite = res.write.bind(res);
    const origEnd = res.end.bind(res);

    res.write = (chunk, encoding, cb) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return origWrite(chunk, encoding, cb);
    };

    res.end = (chunk, encoding, cb) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const result = origEnd(chunk, encoding, cb);
      const text = Buffer.concat(chunks).toString('utf8');
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        // respuesta no JSON
      }
      resolve({ status: res.statusCode, text, json });
      return result;
    };

    expressApp.handle(req, res, reject);
  });
}

describe('Backend — Pruebas HTTP en memoria de endpoints, autenticación y validación', () => {
  it('GET /health responde 200 ok', async () => {
    const res = await invokeApp(app, { method: 'GET', url: '/health' });
    assert.equal(res.status, 200);
    assert.equal(res.json.status, 'ok');
  });

  it('POST /api/login con body vacío responde 400 con errores de validación detallados', async () => {
    const res = await invokeApp(app, {
      method: 'POST',
      url: '/api/login',
      body: {},
    });
    assert.equal(res.status, 400);
    assert.equal(res.json.ok, false);
    assert.equal(res.json.message, 'Errores de validación');
    assert.ok(Array.isArray(res.json.errors) && res.json.errors.length > 0);
  });

  const protectedEndpoints = [
    ['GET', '/api/login/me'],
    ['PATCH', '/api/login'],
    ['GET', '/api/admin/auth/roles'],
    ['GET', '/api/admin/auth/usuarios'],
    ['GET', '/api/admin/persona-admin'],
    ['GET', '/api/admin/calle'],
    ['GET', '/api/admin/tarifa'],
    ['GET', '/api/admin/socio'],
    ['GET', '/api/admin/acciones/agua'],
    ['GET', '/api/admin/acciones/alcantarillado'],
    ['GET', '/api/admin/accion'],
    ['GET', '/api/admin/gestion'],
    ['GET', '/api/admin/cobro'],
    ['GET', '/api/admin/lectura'],
    ['GET', '/api/admin/pago-agua'],
    ['GET', '/api/admin/inventario'],
    ['GET', '/api/admin/asamblea'],
    ['GET', '/api/admin/multa'],
    ['GET', '/api/admin/alcantarillado/accion'],
    ['GET', '/api/admin/cambio-nombre'],
    ['GET', '/api/admin/recibo-universal'],
    ['GET', '/api/admin/egresos'],
    ['GET', '/api/admin/cobros-generales/recibos'],
    ['GET', '/api/admin/reportes/cobro'],
    ['GET', '/api/socio/me'],
    ['GET', '/api/cliente/me'],
  ];

  for (const [method, endpoint] of protectedEndpoints) {
    it(`${method} ${endpoint} rechaza peticiones sin token (401)`, async () => {
      const res = await invokeApp(app, { method, url: endpoint });
      assert.equal(res.status, 401);
    });
  }
});

describe('Backend — Middlewares de validación y errores', () => {
  it('validateSchema devuelve 400 y lista de campos cuando falla Zod', () => {
    const schema = z.object({
      contrasenia: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    });
    const req = { body: { contrasenia: '123' } };
    let statusCode;
    let payload;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        payload = data;
        return this;
      },
    };
    let nextCalled = false;
    validateSchema(schema)(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 400);
    assert.equal(payload.ok, false);
    assert.equal(payload.errors[0].field, 'contrasenia');
    assert.equal(
      payload.errors[0].message,
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('validateRequest valida params y body y adjunta req.validated', async () => {
    const mw = validateRequest({
      paramsSchema: z.object({ id: z.coerce.number().int().positive() }),
      bodySchema: z.object({ nombre: z.string().min(2) }),
    });
    const req = { params: { id: '42' }, body: { nombre: 'OTB' }, query: {} };
    let nextCalled = false;
    await mw(req, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.deepEqual(req.validated, { params: { id: 42 }, body: { nombre: 'OTB' } });
  });

  it('errorHandler responde con statusCode y mensaje del error', () => {
    const err = new Error('Registro duplicado');
    err.statusCode = 409;
    let statusCode;
    let payload;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        payload = data;
        return this;
      },
    };
    errorHandler(err, {}, res, () => {});
    assert.equal(statusCode, 409);
    assert.deepEqual(payload, { ok: false, message: 'Registro duplicado' });
  });
});

describe('Backend — UpdateUseCase (Acción Agua): no duplica cobros al agregar nuevos detalles', () => {
  it('crea cobros únicamente para los detalles recién agregados y deduplica IDs', async () => {
    const cobrosCreados = [];
    const cobrosAccionCreados = [];

    mock.method(sequelize, 'transaction', async (cb) => cb({ fakeTx: true }));
    mock.method(AccionAguaRepository, 'getById', async () => ({
      id: 10,
      socio_id: 5,
    }));
    mock.method(AccionAguaRepository, 'update', async () => ({ id: 10 }));
    mock.method(DetalleAguaRepo, 'getByArrayIds', async ({ detallesAccion }) =>
      detallesAccion.map((id) => ({ id })),
    );
    mock.method(AccionDetalleAguaRepo, 'getCambios', async () => ({
      aEliminar: [],
      aAgregar: [3],
    }));
    mock.method(AccionDetalleAguaRepo, 'createByArray', async () => [
      { id: 99, accion_id: 10, detalle_accion_id: 3 },
    ]);
    mock.method(PeriodoRepository, 'getPeriodoActual', async () => ({ id: 7 }));

    let receivedFilterIds = null;
    mock.method(
      AccionDetalleAguaRepo,
      'getAccionDetalleWithDetalle',
      async ({ accionDetalleIds }) => {
        receivedFilterIds = accionDetalleIds;
        return [{ id: 99, nombre_accion: 'Nuevo detalle', precio_accion: 150 }];
      },
    );
    mock.method(CobroRepository, 'create', async ({ payload }) => {
      cobrosCreados.push(payload);
      return { id: 500 + cobrosCreados.length };
    });
    mock.method(CobroAccionRespository, 'create', async ({ payload }) => {
      cobrosAccionCreados.push(payload);
      return payload;
    });

    try {
      await UpdateAguaUseCase.execute({
        id: 10,
        payload: { detallesAccion: [1, 2, 3, 3] },
      });

      assert.deepEqual(receivedFilterIds, [99]);
      assert.equal(cobrosCreados.length, 1);
      assert.equal(cobrosCreados[0].descripcion, 'Nuevo detalle');
      assert.equal(cobrosAccionCreados.length, 1);
      assert.equal(cobrosAccionCreados[0].accion_detalle_id, 99);
    } finally {
      mock.restoreAll();
    }
  });
});
