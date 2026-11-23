import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ReciboController } from '../src/modules/cobrosGenerales/recibo/controller.js';
import { GetAllBySocioUseCase } from '../src/modules/cobrosGenerales/recibo/use-case/get-all-by.socio.use-case.js';
import { AccionController } from '../src/modules/acciones/accion/controller.js';
import { GetSelectByServicioUseCase } from '../src/modules/acciones/accion/use-case/get-select-by-servicio.use-case.js';
import { CobroReportesController } from '../src/modules/reportes/cobros/controller.js';
import { GetCobrosSocioUseCase } from '../src/modules/reportes/cobros/use-case/get-cobro-por-socio.use-case.js';
import { GetCobrosPorFechaPorSocioUseCase } from '../src/modules/reportes/cobros/use-case/get-cobro-por-fecha-por-socio.use-case.js';
import { CobroReportesRepository } from '../src/modules/reportes/cobros/repository.js';
import { ReciboReporteController } from '../src/modules/reportes/recibos/controller.js';
import { GetRecibosPorSocioUseCase } from '../src/modules/reportes/recibos/use-case/get-recibos-por-socio.use-case.js';
import { GetRecibosPorFechaPorSocioUseCase } from '../src/modules/reportes/recibos/use-case/get-recibos-por-fecha-por-socio.use-case.js';

function createMockRes() {
  return {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };
}

describe('Backend — Reportes y Recibos (correcciones de controladores y use-cases)', () => {
  it('ReciboController.getAllBySocio invoca GetAllBySocioUseCase con socio_id', async (t) => {
    let received;
    t.mock.method(GetAllBySocioUseCase, 'execute', async (args) => {
      received = args;
      return [{ id: 1 }];
    });

    const res = createMockRes();
    await ReciboController.getAllBySocio(
      { validated: { params: { id: 7 } } },
      res,
    );

    assert.equal(res.statusCode, 200);
    assert.deepEqual(received, { socio_id: 7 });
  });

  it('AccionController.getSelectByServicio acepta tanto query (GET) como body (POST)', async (t) => {
    const calls = [];
    t.mock.method(GetSelectByServicioUseCase, 'execute', async (args) => {
      calls.push(args);
      return [{ value: 0, label: 'TODOS' }];
    });

    const resQuery = createMockRes();
    await AccionController.getSelectByServicio(
      { validated: { query: { tipo_servicio: 'AGUA', search: '10' } } },
      resQuery,
    );

    const resBody = createMockRes();
    await AccionController.getSelectByServicio(
      { validated: { body: { tipo_servicio: 'ALCANTARILLADO' } } },
      resBody,
    );

    assert.equal(resQuery.statusCode, 200);
    assert.equal(resBody.statusCode, 200);
    assert.deepEqual(calls, [
      { tipo_servicio: 'AGUA', search: '10' },
      { tipo_servicio: 'ALCANTARILLADO', search: undefined },
    ]);
  });

  it('CobroReportesController.getCobrosSocio envía socio_id al use-case', async (t) => {
    let received;
    t.mock.method(GetCobrosSocioUseCase, 'execute', async (args) => {
      received = args;
      return { data: [] };
    });

    const query = { page: 1, limit: 10 };
    const res = createMockRes();
    await CobroReportesController.getCobrosSocio(
      { validated: { params: { id: 12 }, query } },
      res,
    );

    assert.equal(res.statusCode, 200);
    assert.deepEqual(received, { socio_id: 12, query });
  });

  it('CobroReportesController.getCobrosPorFechaPorSocio envía socio_id y llama a getCobrosPorFechaPorSocio', async (t) => {
    let repoArgs;
    t.mock.method(
      CobroReportesRepository,
      'getCobrosPorFechaPorSocio',
      async (args) => {
        repoArgs = args;
        return [];
      },
    );

    const body = {
      estado: 'PAGADO',
      fecha_inicio: '2026-01-01',
      fecha_final: '2026-01-31',
      tipo_cobro: 'TODOS',
    };
    const res = createMockRes();
    await CobroReportesController.getCobrosPorFechaPorSocio(
      { validated: { params: { id: 15 }, body } },
      res,
    );

    assert.equal(res.statusCode, 200);
    assert.deepEqual(repoArgs, { ...body, socio_id: 15 });
  });

  it('ReciboReporteController envía socio_id en getRecibosPorSocio y GetRecibosPorFechaPorSocio', async (t) => {
    let socioArgs;
    let socioFechaArgs;

    t.mock.method(GetRecibosPorSocioUseCase, 'execute', async (args) => {
      socioArgs = args;
      return { data: [] };
    });
    t.mock.method(
      GetRecibosPorFechaPorSocioUseCase,
      'execute',
      async (args) => {
        socioFechaArgs = args;
        return [];
      },
    );

    const query = { page: 1, limit: 10 };
    const body = { fecha_inicio: '2026-01-01', fecha_final: '2026-01-31' };

    const res1 = createMockRes();
    await ReciboReporteController.getRecibosPorSocio(
      { validated: { params: { id: 20 }, query } },
      res1,
    );

    const res2 = createMockRes();
    await ReciboReporteController.GetRecibosPorFechaPorSocio(
      { validated: { params: { id: 21 }, body } },
      res2,
    );

    assert.equal(res1.statusCode, 200);
    assert.equal(res2.statusCode, 200);
    assert.deepEqual(socioArgs, { socio_id: 20, query });
    assert.deepEqual(socioFechaArgs, { socio_id: 21, body });
  });
});
