const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  description: 'Identificador numérico',
};

const jsonBody = (properties, required = []) => ({
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        ...(required.length ? { required } : {}),
        properties,
      },
    },
  },
});

const okResp = (description = 'Operación exitosa') => ({
  200: {
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
  },
  400: { $ref: '#/components/responses/ValidationError' },
  401: { $ref: '#/components/responses/Unauthorized' },
});

export const accionesCobrosPaths = {
  '/api/admin/acciones/agua': {
    get: { tags: ['Acciones - Agua'], summary: 'Listar acciones de agua', responses: okResp() },
    post: {
      tags: ['Acciones - Agua'],
      summary: 'Crear acción de agua',
      requestBody: jsonBody(
        {
          socio_id: { type: 'integer' },
          calle_id: { type: 'integer' },
          tarifa_id: { type: 'integer' },
          codigo_interno: { type: 'integer', example: 1050 },
          nro_medidor: { type: 'string', example: 'MED-202650' },
          direccion: { type: 'string' },
          observacion: { type: 'string' },
          detallesAccion: { type: 'array', items: { type: 'integer' } },
        },
        ['socio_id', 'calle_id', 'tarifa_id', 'codigo_interno', 'direccion'],
      ),
      responses: okResp('Acción de agua creada'),
    },
  },
  '/api/admin/acciones/agua/socios': { get: { tags: ['Acciones - Agua'], summary: 'Selector de socios', responses: okResp() } },
  '/api/admin/acciones/agua/tarifa': { get: { tags: ['Acciones - Agua'], summary: 'Selector de tarifas', responses: okResp() } },
  '/api/admin/acciones/agua/calle': { get: { tags: ['Acciones - Agua'], summary: 'Selector de calles', responses: okResp() } },
  '/api/admin/acciones/agua/tipos-accion': { get: { tags: ['Acciones - Agua'], summary: 'Selector de tipos de acción', responses: okResp() } },
  '/api/admin/acciones/agua/detalle-accion/{id}': {
    get: { tags: ['Acciones - Agua'], summary: 'Listar detalles de acción por tipo de acción', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/acciones/agua/{id}': {
    get: { tags: ['Acciones - Agua'], summary: 'Obtener acción de agua por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Acciones - Agua'],
      summary: 'Actualizar acción de agua',
      parameters: [idParam],
      requestBody: jsonBody({
        calle_id: { type: 'integer' },
        tarifa_id: { type: 'integer' },
        nro_medidor: { type: 'string' },
        direccion: { type: 'string' },
        estado: { type: 'string', enum: ['ACTIVO', 'PASIVO', 'ANULADO', 'TRASPASO_A_ACCION_AGUA'] },
        detallesAccion: { type: 'array', items: { type: 'integer' } },
      }),
      responses: okResp('Acción actualizada'),
    },
  },
  '/api/admin/acciones/agua/cambiar-nombre': {
    post: {
      tags: ['Acciones - Agua'],
      summary: 'Registrar cambio de nombre en acción de agua',
      requestBody: jsonBody(
        {
          accion_id: { type: 'integer' },
          socio_nuevo_id: { type: 'integer' },
          tipo: { type: 'string', enum: ['FAMILIAR', 'AJENO'] },
          observacion: { type: 'string' },
          monto: { type: 'number' },
        },
        ['accion_id', 'socio_nuevo_id', 'tipo', 'observacion', 'monto'],
      ),
      responses: okResp('Cambio de nombre registrado'),
    },
  },
  '/api/admin/acciones/agua/detalle': {
    get: { tags: ['Acciones - Detalle y Tipo'], summary: 'Listar detalles de acción agua', responses: okResp() },
    post: {
      tags: ['Acciones - Detalle y Tipo'],
      summary: 'Crear detalle de acción agua',
      requestBody: jsonBody(
        { tipo_accion_id: { type: 'integer' }, nombre_accion: { type: 'string' }, precio_accion: { type: 'number' }, tipo_cobro: { type: 'string', enum: ['UNICO', 'MENSUAL'] } },
        ['tipo_accion_id', 'nombre_accion', 'precio_accion', 'tipo_cobro'],
      ),
      responses: okResp('Detalle creado'),
    },
  },
  '/api/admin/acciones/agua/detalle/tipos-accion': { get: { tags: ['Acciones - Detalle y Tipo'], summary: 'Selector de tipos de acción', responses: okResp() } },
  '/api/admin/acciones/agua/detalle/{id}': {
    get: { tags: ['Acciones - Detalle y Tipo'], summary: 'Obtener detalle de acción por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Acciones - Detalle y Tipo'],
      summary: 'Actualizar detalle de acción agua',
      parameters: [idParam],
      requestBody: jsonBody({ tipo_accion_id: { type: 'integer' }, nombre_accion: { type: 'string' }, precio_accion: { type: 'number' }, tipo_cobro: { type: 'string', enum: ['UNICO', 'MENSUAL'] } }),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/agua/detalle/change-status/{id}': {
    patch: { tags: ['Acciones - Detalle y Tipo'], summary: 'Cambiar estado de detalle de acción agua', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/acciones/agua/tipo-accion': {
    get: { tags: ['Acciones - Detalle y Tipo'], summary: 'Listar tipos de acción', responses: okResp() },
    post: {
      tags: ['Acciones - Detalle y Tipo'],
      summary: 'Crear tipo de acción',
      requestBody: jsonBody({ nombre_tipo_accion: { type: 'string' } }, ['nombre_tipo_accion']),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/agua/tipo-accion/{id}': {
    put: {
      tags: ['Acciones - Detalle y Tipo'],
      summary: 'Actualizar tipo de acción',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_tipo_accion: { type: 'string' } }, ['nombre_tipo_accion']),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/alcantarillado': {
    get: { tags: ['Acciones - Alcantarillado'], summary: 'Listar acciones de alcantarillado', responses: okResp() },
    post: {
      tags: ['Acciones - Alcantarillado'],
      summary: 'Crear acción de alcantarillado',
      requestBody: jsonBody(
        { socio_id: { type: 'integer' }, calle_id: { type: 'integer' }, codigo_interno: { type: 'integer' }, direccion: { type: 'string' }, detallesAccion: { type: 'array', items: { type: 'integer' } } },
        ['socio_id', 'calle_id', 'codigo_interno', 'direccion'],
      ),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/alcantarillado/socio': { get: { tags: ['Acciones - Alcantarillado'], summary: 'Selector de socios', responses: okResp() } },
  '/api/admin/acciones/alcantarillado/calle': { get: { tags: ['Acciones - Alcantarillado'], summary: 'Selector de calles', responses: okResp() } },
  '/api/admin/acciones/alcantarillado/detalles-accion': { get: { tags: ['Acciones - Alcantarillado'], summary: 'Selector de detalles de alcantarillado', responses: okResp() } },
  '/api/admin/acciones/alcantarillado/{id}': {
    get: { tags: ['Acciones - Alcantarillado'], summary: 'Obtener acción de alcantarillado por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Acciones - Alcantarillado'],
      summary: 'Actualizar acción de alcantarillado',
      parameters: [idParam],
      requestBody: jsonBody({ calle_id: { type: 'integer' }, direccion: { type: 'string' }, estado: { type: 'string', enum: ['ACTIVO', 'PASIVO', 'ANULADO'] }, detallesAccion: { type: 'array', items: { type: 'integer' } } }),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/alcantarillado/cambiar-nombre': {
    post: {
      tags: ['Acciones - Alcantarillado'],
      summary: 'Registrar cambio de nombre en acción de alcantarillado',
      requestBody: jsonBody(
        { accion_id: { type: 'integer' }, socio_nuevo_id: { type: 'integer' }, tipo: { type: 'string', enum: ['FAMILIAR', 'AJENO'] }, observacion: { type: 'string' }, monto: { type: 'number' } },
        ['accion_id', 'socio_nuevo_id', 'tipo', 'observacion', 'monto'],
      ),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/alcantarillado/detalle': {
    get: { tags: ['Acciones - Alcantarillado'], summary: 'Listar detalles de alcantarillado', responses: okResp() },
    post: {
      tags: ['Acciones - Alcantarillado'],
      summary: 'Crear detalle de alcantarillado',
      requestBody: jsonBody({ nombre_accion: { type: 'string' }, precio_accion: { type: 'number' }, tipo_cobro: { type: 'string', enum: ['UNICO', 'MENSUAL'] } }, ['nombre_accion', 'precio_accion', 'tipo_cobro']),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/alcantarillado/detalle/{id}': {
    get: { tags: ['Acciones - Alcantarillado'], summary: 'Obtener detalle de alcantarillado por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Acciones - Alcantarillado'],
      summary: 'Actualizar detalle de alcantarillado',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_accion: { type: 'string' }, precio_accion: { type: 'number' }, tipo_cobro: { type: 'string', enum: ['UNICO', 'MENSUAL'] } }),
      responses: okResp(),
    },
  },
  '/api/admin/acciones/alcantarillado/detalle/change-status/{id}': {
    patch: { tags: ['Acciones - Alcantarillado'], summary: 'Cambiar estado de detalle de alcantarillado', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/cobros-generales/cobros/socios/{id}': {
    get: {
      tags: ['Cobros Generales'],
      summary: 'Cobros pendientes de un socio',
      parameters: [idParam, { name: 'tipo_cobro', in: 'query', schema: { type: 'string', default: 'TODOS' } }],
      responses: okResp(),
    },
  },
  '/api/admin/cobros-generales/cobros/accion/{id}': {
    get: {
      tags: ['Cobros Generales'],
      summary: 'Cobros pendientes de una acción',
      parameters: [idParam, { name: 'tipo_cobro', in: 'query', schema: { type: 'string', default: 'TODOS' } }],
      responses: okResp(),
    },
  },
  '/api/admin/cobros-generales/cobros/pagar': {
    post: {
      tags: ['Cobros Generales'],
      summary: 'Registrar pago de uno o varios cobros y emitir recibo',
      requestBody: jsonBody(
        { metodo_pago: { type: 'string', enum: ['EFECTIVO', 'QR'], example: 'EFECTIVO' }, monto: { type: 'number', example: 35.0 }, cobros: { type: 'array', items: { type: 'integer' }, example: [1, 2] } },
        ['metodo_pago', 'monto', 'cobros'],
      ),
      responses: { 201: { description: 'Pago registrado y recibo generado' }, 400: { $ref: '#/components/responses/ValidationError' } },
    },
  },
  '/api/admin/cobros-generales/recibos': {
    get: { tags: ['Cobros Generales'], summary: 'Listar todos los recibos emitidos', responses: okResp() },
  },
  '/api/admin/cobros-generales/recibos/seleccion-socios': {
    get: { tags: ['Cobros Generales'], summary: 'Selector de socios para recibos', parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/cobros-generales/recibos/socio/{id}': {
    get: { tags: ['Cobros Generales'], summary: 'Recibos emitidos de un socio', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/cobros-generales/recibos/accion/{id}': {
    get: { tags: ['Cobros Generales'], summary: 'Recibos emitidos de una acción', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/cobros-generales/recibos/seleccion-accion': {
    post: { tags: ['Cobros Generales'], summary: 'Selector de acciones por tipo de servicio', requestBody: jsonBody({ tipo_servicio: { type: 'string', enum: ['AGUA', 'ALCANTARILLADO'] } }), responses: okResp() },
  },
  '/api/admin/cobro': {
    get: { tags: ['Cobros (Legacy)'], summary: 'Listar socios con cobros', responses: okResp() },
    post: {
      tags: ['Cobros (Legacy)'],
      summary: 'Registrar pago (legacy)',
      requestBody: jsonBody({ socio_id: { type: 'integer' }, monto: { type: 'number' }, cobros: { type: 'array', items: { type: 'integer' } }, metodo_pago: { type: 'string', enum: ['EFECTIVO', 'QR'] } }),
      responses: okResp(),
    },
  },
  '/api/admin/cobro/historial': { get: { tags: ['Cobros (Legacy)'], summary: 'Historial de cobros pagados/parciales', responses: okResp() } },
  '/api/admin/cobro/multas': { get: { tags: ['Cobros (Legacy)'], summary: 'Selector de multas', responses: okResp() } },
  '/api/admin/cobro/acciones-pasivas': { get: { tags: ['Cobros (Legacy)'], summary: 'Listar acciones pasivas', responses: okResp() } },
  '/api/admin/cobro/{id}': { get: { tags: ['Cobros (Legacy)'], summary: 'Cobros de un socio por ID', parameters: [idParam], responses: okResp() } },
  '/api/admin/cobro/accion-historial/{id}': { get: { tags: ['Cobros (Legacy)'], summary: 'Historial de cobros de una acción', parameters: [idParam], responses: okResp() } },
  '/api/admin/cobro/multas/{id}': {
    post: { tags: ['Cobros (Legacy)'], summary: 'Asignar multa a una acción', parameters: [idParam], requestBody: jsonBody({ multa_id: { type: 'integer' } }, ['multa_id']), responses: okResp() },
  },
  '/api/admin/cobro/crear-cobro': {
    post: {
      tags: ['Cobros (Legacy)'],
      summary: 'Crear cobro universal para una acción',
      requestBody: jsonBody({ accion_id: { type: 'integer' }, concepto: { type: 'string' }, descripcion: { type: 'string' }, monto: { type: 'number' } }, ['accion_id', 'concepto', 'descripcion', 'monto']),
      responses: okResp('Cobro universal creado'),
    },
  },
  '/api/pagos-qr': {
    get: { tags: ['Pago QR'], summary: 'Listar pagos QR generados', responses: okResp() },
    post: {
      tags: ['Pago QR'],
      summary: 'Generar nuevo código QR (Banco Económico)',
      requestBody: jsonBody({ amount: { type: 'number' }, description: { type: 'string' }, dueDate: { type: 'string', format: 'date' } }),
      responses: okResp(),
    },
  },
  '/api/pagos-qr/conciliar/{fecha}': {
    post: {
      tags: ['Pago QR'],
      summary: 'Conciliar pagos QR por fecha (YYYY-MM-DD)',
      parameters: [{ name: 'fecha', in: 'path', required: true, schema: { type: 'string', example: '2026-10-18' } }],
      responses: okResp(),
    },
  },
  '/api/pagos-qr/{id}/status': { get: { tags: ['Pago QR'], summary: 'Consultar estado de pago QR', parameters: [idParam], responses: okResp() } },
  '/api/pagos-qr/{id}': { get: { tags: ['Pago QR'], summary: 'Obtener pago QR por ID', parameters: [idParam], responses: okResp() } },
};
