import { catalogosPaths } from './paths.catalogos.js';
import { accionesCobrosPaths } from './paths.accionesCobros.js';
import { operativoReportesPaths } from './paths.operativoReportes.js';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API OTB Huayllani Oeste',
    version: '1.0.0',
    description:
      'Documentación OpenAPI 3.0.3 de todos los endpoints activos del backend de gestión de agua, alcantarillado, cobros, lecturas, asambleas, egresos y reportes.',
  },
  servers: [
    {
      url: '/',
      description: 'Servidor actual',
    },
  ],
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Health', description: 'Verificación de estado del servicio' },
    { name: 'Login', description: 'Autenticación y sesión' },
    { name: 'Auth - Roles', description: 'Roles y permisos del sistema' },
    { name: 'Auth - Usuarios', description: 'Cuentas de usuario' },
    { name: 'Administradores', description: 'Personal administrativo' },
    { name: 'Calles', description: 'Catálogo de calles y ramales' },
    { name: 'Tarifas', description: 'Tarifas de agua y rangos de consumo' },
    { name: 'Socios', description: 'Registro y gestión de socios' },
    { name: 'Gestiones y Periodos', description: 'Gestiones anuales y periodos mensuales' },
    { name: 'Acciones - Agua', description: 'Acciones de servicio de agua' },
    { name: 'Acciones - Detalle y Tipo', description: 'Catálogo de tipos y detalles de acción' },
    { name: 'Acciones - Alcantarillado', description: 'Acciones y detalles de alcantarillado' },
    { name: 'Cobros Generales', description: 'Cobros unificados y recibos' },
    { name: 'Cobros (Legacy)', description: 'Endpoints auxiliares y legacy de cobros' },
    { name: 'Pago QR', description: 'Integración de pagos QR Banco Económico' },
    { name: 'Lecturas', description: 'Registro y consulta de lecturas de medidores' },
    { name: 'Inventario', description: 'Control de materiales e inventario' },
    { name: 'Asambleas', description: 'Asambleas, asistencias y reportes PDF' },
    { name: 'Multas', description: 'Catálogo y asignación de multas' },
    { name: 'Egresos', description: 'Categorías de gastos y registro de egresos' },
    { name: 'Reportes - Cobros', description: 'Reportes filtrados de cobros' },
    { name: 'Reportes - Recibos', description: 'Reportes filtrados de recibos' },
    { name: 'Pruebas PDF', description: 'Generadores PDF de prueba' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido desde POST /api/login',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operación exitosa' },
          data: {},
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Errores de validación' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Error de validación en parámetros o cuerpo de la solicitud',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Unauthorized: {
        description: 'Token JWT ausente, inválido o expirado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },
  paths: {
    ...catalogosPaths,
    ...accionesCobrosPaths,
    ...operativoReportesPaths,
  },
};
