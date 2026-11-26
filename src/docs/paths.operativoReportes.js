const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  description: 'Identificador numérico',
};

const paginationParams = [
  { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
  { name: 'search', in: 'query', schema: { type: 'string' } },
];

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

const fechasBody = jsonBody(
  {
    fecha_inicio: { type: 'string', format: 'date', example: '2026-10-01' },
    fecha_final: { type: 'string', format: 'date', example: '2026-10-31' },
    estado: { type: 'string', example: 'TODOS' },
    tipo_cobro: { type: 'string', example: 'TODOS' },
  },
  ['fecha_inicio', 'fecha_final'],
);

export const operativoReportesPaths = {
  '/api/admin/lectura/lectura': {
    get: { tags: ['Lecturas'], summary: 'Listar acciones con su última lectura registrada', responses: okResp() },
  },
  '/api/admin/lectura/lectura/{id}': {
    post: {
      tags: ['Lecturas'],
      summary: 'Registrar lectura de agua del periodo activo para una acción',
      parameters: [idParam],
      requestBody: jsonBody(
        { lectura_actual: { type: 'integer', minimum: 1, example: 150 }, observacion: { type: 'string', minLength: 5, example: 'Lectura normal' } },
        ['lectura_actual'],
      ),
      responses: okResp('Lectura y cobro registrados'),
    },
  },
  '/api/admin/inventario': {
    get: { tags: ['Inventario'], summary: 'Listar productos de inventario', parameters: paginationParams, responses: okResp() },
    post: {
      tags: ['Inventario'],
      summary: 'Crear producto en inventario',
      requestBody: jsonBody({ nombre_producto: { type: 'string', example: 'Medidor 1/2"' }, saldo_actual: { type: 'integer', example: 20 } }, ['nombre_producto', 'saldo_actual']),
      responses: okResp('Producto creado'),
    },
  },
  '/api/admin/inventario/{id}': {
    patch: {
      tags: ['Inventario'],
      summary: 'Actualizar producto de inventario',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_producto: { type: 'string' }, saldo_actual: { type: 'integer' } }),
      responses: okResp(),
    },
  },
  '/api/admin/inventario/sumar/{id}': { get: { tags: ['Inventario'], summary: 'Registrar salida (+1 salida / -1 saldo)', parameters: [idParam], responses: okResp() } },
  '/api/admin/inventario/restar/{id}': { get: { tags: ['Inventario'], summary: 'Revertir salida (-1 salida / +1 saldo)', parameters: [idParam], responses: okResp() } },
  '/api/admin/asamblea': {
    get: {
      tags: ['Asambleas'],
      summary: 'Listar asambleas',
      parameters: [...paginationParams, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
      responses: okResp(),
    },
    post: {
      tags: ['Asambleas'],
      summary: 'Crear asamblea y generar lista de asistencia',
      requestBody: jsonBody(
        { titulo: { type: 'string', example: 'Asamblea Ordinaria' }, fecha: { type: 'string', format: 'date', example: '2026-10-25' }, hora_inicio: { type: 'string', example: '09:00:00' }, lugar: { type: 'string', example: 'Sede OTB' }, monto_multa: { type: 'number', example: 50 }, monto_retraso: { type: 'number', example: 20 } },
        ['titulo', 'fecha', 'hora_inicio', 'lugar', 'monto_multa', 'monto_retraso'],
      ),
      responses: okResp('Asamblea creada'),
    },
  },
  '/api/admin/asamblea/{id}': {
    get: { tags: ['Asambleas'], summary: 'Obtener asamblea por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Asambleas'],
      summary: 'Actualizar asamblea',
      parameters: [idParam],
      requestBody: jsonBody({ titulo: { type: 'string' }, fecha: { type: 'string', format: 'date' }, hora_inicio: { type: 'string' }, lugar: { type: 'string' }, monto_multa: { type: 'number' }, monto_retraso: { type: 'number' } }),
      responses: okResp(),
    },
  },
  '/api/admin/asamblea/acciones/{id}': { get: { tags: ['Asambleas'], summary: 'Lista de asistencia de una asamblea', parameters: [idParam], responses: okResp() } },
  '/api/admin/asamblea/accion/{id}': {
    patch: {
      tags: ['Asambleas'],
      summary: 'Actualizar estado de asistencia de una acción',
      parameters: [idParam],
      requestBody: jsonBody({ asistio: { type: 'string', enum: ['ASISTIO', 'FALTA', 'SIN EFECTO', 'PERMISO', 'RETRASO'] }, observacion: { type: 'string' } }, ['asistio']),
      responses: okResp(),
    },
  },
  '/api/admin/asamblea/reporte/{id}': {
    get: { tags: ['Asambleas'], summary: 'Descargar reporte PDF de asistencia de asamblea', parameters: [idParam], responses: { 200: { description: 'Archivo PDF', content: { 'application/pdf': {} } } } },
  },
  '/api/admin/multa': {
    get: { tags: ['Multas'], summary: 'Listar catálogo de multas', parameters: paginationParams, responses: okResp() },
    post: {
      tags: ['Multas'],
      summary: 'Crear multa',
      requestBody: jsonBody({ nombre_multa: { type: 'string', example: 'Inasistencia a asamblea' }, precio: { type: 'number', example: 50 } }, ['nombre_multa', 'precio']),
      responses: okResp(),
    },
  },
  '/api/admin/multa/multas/{id}': {
    post: { tags: ['Multas'], summary: 'Asignar multa a una acción', parameters: [idParam], requestBody: jsonBody({ multa_id: { type: 'integer' } }, ['multa_id']), responses: okResp() },
  },
  '/api/admin/multa/{id}': {
    patch: { tags: ['Multas'], summary: 'Actualizar multa', parameters: [idParam], requestBody: jsonBody({ nombre_multa: { type: 'string' }, precio: { type: 'number' } }), responses: okResp() },
  },
  '/api/admin/multa/cambiar-estado/{id}': { patch: { tags: ['Multas'], summary: 'Activar o desactivar multa', parameters: [idParam], responses: okResp() } },
  '/api/admin/egresos': {
    get: { tags: ['Egresos'], summary: 'Listar egresos', responses: okResp() },
    post: {
      tags: ['Egresos'],
      summary: 'Registrar egreso',
      requestBody: jsonBody(
        { categoria_egreso_id: { type: 'integer' }, fecha: { type: 'string', format: 'date', example: '2026-10-15' }, concepto: { type: 'string' }, monto: { type: 'number', example: 250.5 }, beneficiario: { type: 'string' }, observaciones: { type: 'string' } },
        ['categoria_egreso_id', 'fecha', 'concepto', 'monto', 'beneficiario', 'observaciones'],
      ),
      responses: okResp(),
    },
  },
  '/api/admin/egresos/beneficiarios': { get: { tags: ['Egresos'], summary: 'Listar beneficiarios registrados', responses: okResp() } },
  '/api/admin/egresos/{id}': {
    patch: {
      tags: ['Egresos'],
      summary: 'Actualizar egreso',
      parameters: [idParam],
      requestBody: jsonBody({ categoria_egreso_id: { type: 'integer' }, fecha: { type: 'string', format: 'date' }, concepto: { type: 'string' }, monto: { type: 'number' }, beneficiario: { type: 'string' }, observaciones: { type: 'string' } }),
      responses: okResp(),
    },
  },
  '/api/admin/egresos/cambiar-estado/{id}': { patch: { tags: ['Egresos'], summary: 'Activar o desactivar egreso', parameters: [idParam], responses: okResp() } },
  '/api/admin/egresos/categoria-gastos': {
    get: { tags: ['Egresos'], summary: 'Listar categorías de gastos', responses: okResp() },
    post: {
      tags: ['Egresos'],
      summary: 'Crear categoría de gasto',
      requestBody: jsonBody({ nombre_gasto: { type: 'string' }, descripcion: { type: 'string' } }, ['nombre_gasto', 'descripcion']),
      responses: okResp(),
    },
  },
  '/api/admin/egresos/categoria-gastos/{id}': {
    patch: { tags: ['Egresos'], summary: 'Actualizar categoría de gasto', parameters: [idParam], requestBody: jsonBody({ nombre_gasto: { type: 'string' }, descripcion: { type: 'string' } }), responses: okResp() },
  },
  '/api/admin/reportes/cobro': {
    get: { tags: ['Reportes - Cobros'], summary: 'Reporte general de cobros (paginado)', parameters: [...paginationParams, { name: 'tipo_cobro', in: 'query', schema: { type: 'string' } }, { name: 'estado', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/reportes/cobro/acciones': {
    get: { tags: ['Reportes - Cobros'], summary: 'Selector de acciones por tipo de servicio', parameters: [{ name: 'tipo_servicio', in: 'query', schema: { type: 'string', enum: ['AGUA', 'ALCANTARILLADO'] } }, { name: 'search', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/reportes/cobro/socios': {
    get: { tags: ['Reportes - Cobros'], summary: 'Selector de socios', parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/reportes/cobro/fechas': { post: { tags: ['Reportes - Cobros'], summary: 'Reporte de cobros por rango de fechas', requestBody: fechasBody, responses: okResp() } },
  '/api/admin/reportes/cobro/accion/{id}': { get: { tags: ['Reportes - Cobros'], summary: 'Reporte de cobros por acción', parameters: [idParam, ...paginationParams], responses: okResp() } },
  '/api/admin/reportes/cobro/accion/fechas/{id}': { post: { tags: ['Reportes - Cobros'], summary: 'Reporte de cobros por acción y fechas', parameters: [idParam], requestBody: fechasBody, responses: okResp() } },
  '/api/admin/reportes/cobro/socio/{id}': { get: { tags: ['Reportes - Cobros'], summary: 'Reporte de cobros por socio', parameters: [idParam, ...paginationParams], responses: okResp() } },
  '/api/admin/reportes/cobro/socio/fechas/{id}': { post: { tags: ['Reportes - Cobros'], summary: 'Reporte de cobros por socio y fechas', parameters: [idParam], requestBody: fechasBody, responses: okResp() } },
  '/api/admin/reportes/recibo': {
    get: { tags: ['Reportes - Recibos'], summary: 'Reporte general de recibos (paginado)', parameters: [...paginationParams, { name: 'tipo_cobro', in: 'query', schema: { type: 'string' } }, { name: 'estado', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/reportes/recibo/acciones': {
    get: { tags: ['Reportes - Recibos'], summary: 'Selector de acciones por tipo de servicio', parameters: [{ name: 'tipo_servicio', in: 'query', schema: { type: 'string', enum: ['AGUA', 'ALCANTARILLADO'] } }, { name: 'search', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/reportes/recibo/socios': {
    get: { tags: ['Reportes - Recibos'], summary: 'Selector de socios', parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }], responses: okResp() },
  },
  '/api/admin/reportes/recibo/fechas': { post: { tags: ['Reportes - Recibos'], summary: 'Reporte de recibos por rango de fechas', requestBody: fechasBody, responses: okResp() } },
  '/api/admin/reportes/recibo/accion/{id}': { get: { tags: ['Reportes - Recibos'], summary: 'Reporte de recibos por acción', parameters: [idParam, ...paginationParams], responses: okResp() } },
  '/api/admin/reportes/recibo/accion/fechas/{id}': { post: { tags: ['Reportes - Recibos'], summary: 'Reporte de recibos por acción y fechas', parameters: [idParam], requestBody: fechasBody, responses: okResp() } },
  '/api/admin/reportes/recibo/socio/{id}': { get: { tags: ['Reportes - Recibos'], summary: 'Reporte de recibos por socio', parameters: [idParam, ...paginationParams], responses: okResp() } },
  '/api/admin/reportes/recibo/socio/fechas/{id}': { post: { tags: ['Reportes - Recibos'], summary: 'Reporte de recibos por socio y fechas', parameters: [idParam], requestBody: fechasBody, responses: okResp() } },
  '/api/prueba/recibo': { get: { tags: ['Pruebas PDF'], summary: 'Generar PDF de recibo de prueba', security: [], responses: { 200: { description: 'PDF generado', content: { 'application/pdf': {} } } } } },
  '/api/prueba/caratula': { get: { tags: ['Pruebas PDF'], summary: 'Generar PDF de carátula de prueba', security: [], responses: { 200: { description: 'PDF generado', content: { 'application/pdf': {} } } } } },
  '/api/prueba/reunion': { get: { tags: ['Pruebas PDF'], summary: 'Generar PDF de reunión de prueba', security: [], responses: { 200: { description: 'PDF generado', content: { 'application/pdf': {} } } } } },
};
