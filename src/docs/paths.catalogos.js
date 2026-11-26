const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  description: 'Identificador numérico del registro',
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

export const catalogosPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Estado del servidor',
      security: [],
      responses: { 200: { description: 'API funcionando' } },
    },
  },
  '/api/login': {
    post: {
      tags: ['Login'],
      summary: 'Iniciar sesión (Admin o Socio)',
      security: [],
      requestBody: jsonBody(
        {
          nombre_usuario: { type: 'string', example: 'super_admin' },
          contrasenia_usuario: { type: 'string', example: 'admin_super_admin' },
        },
        ['nombre_usuario', 'contrasenia_usuario'],
      ),
      responses: okResp('Token JWT y datos del usuario'),
    },
    patch: {
      tags: ['Login'],
      summary: 'Cambiar contraseña del usuario autenticado',
      requestBody: jsonBody(
        {
          contrasenia_antigua: { type: 'string' },
          contrasenia_nueva: { type: 'string' },
        },
        ['contrasenia_antigua', 'contrasenia_nueva'],
      ),
      responses: okResp('Contraseña actualizada'),
    },
  },
  '/api/login/me': {
    get: {
      tags: ['Login'],
      summary: 'Obtener perfil del usuario autenticado',
      responses: okResp('Datos del usuario y permisos'),
    },
  },
  '/api/admin/auth/roles': {
    get: { tags: ['Auth - Roles'], summary: 'Listar roles paginados', parameters: paginationParams, responses: okResp() },
    post: {
      tags: ['Auth - Roles'],
      summary: 'Crear rol con permisos',
      requestBody: jsonBody(
        { nombre_rol: { type: 'string', example: 'COBRADOR' }, permisos: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] } },
        ['nombre_rol', 'permisos'],
      ),
      responses: okResp('Rol creado'),
    },
  },
  '/api/admin/auth/roles/permisos': {
    get: { tags: ['Auth - Roles'], summary: 'Listar todos los permisos disponibles', responses: okResp() },
  },
  '/api/admin/auth/roles/{id}': {
    get: { tags: ['Auth - Roles'], summary: 'Obtener rol por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Auth - Roles'],
      summary: 'Actualizar rol y sus permisos',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_rol: { type: 'string' }, permisos: { type: 'array', items: { type: 'integer' } } }),
      responses: okResp('Rol actualizado'),
    },
  },
  '/api/admin/auth/usuarios': {
    get: {
      tags: ['Auth - Usuarios'],
      summary: 'Listar usuarios del sistema',
      parameters: [...paginationParams, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
      responses: okResp(),
    },
    post: {
      tags: ['Auth - Usuarios'],
      summary: 'Crear usuario',
      requestBody: jsonBody(
        { nombre_usuario: { type: 'string' }, contrasenia_usuario: { type: 'string' }, rol_id: { type: 'integer' } },
        ['nombre_usuario', 'contrasenia_usuario', 'rol_id'],
      ),
      responses: okResp('Usuario creado'),
    },
  },
  '/api/admin/auth/usuarios/{id}': {
    get: { tags: ['Auth - Usuarios'], summary: 'Obtener usuario por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Auth - Usuarios'],
      summary: 'Actualizar usuario',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_usuario: { type: 'string' }, contrasenia_usuario: { type: 'string' }, rol_id: { type: 'integer' } }),
      responses: okResp('Usuario actualizado'),
    },
  },
  '/api/admin/auth/usuarios/toggle-status/{id}': {
    patch: { tags: ['Auth - Usuarios'], summary: 'Activar o desactivar usuario', parameters: [idParam], responses: okResp('Estado actualizado') },
  },
  '/api/admin/persona-admin': {
    get: {
      tags: ['Administradores'],
      summary: 'Listar personal administrativo',
      parameters: [...paginationParams, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
      responses: okResp(),
    },
    post: {
      tags: ['Administradores'],
      summary: 'Crear administrador y su usuario',
      requestBody: jsonBody(
        {
          cargo: { type: 'string', example: 'Secretaria' },
          cedula_identidad: { type: 'string', example: '12345678' },
          ci_expedido: { type: 'string', example: 'CB' },
          nombre: { type: 'string' },
          apellido_paterno: { type: 'string' },
          apellido_materno: { type: 'string' },
          rol_id: { type: 'integer' },
          contrasenia: { type: 'string' },
        },
        ['cargo', 'cedula_identidad', 'ci_expedido', 'nombre', 'apellido_paterno', 'rol_id'],
      ),
      responses: okResp('Administrador creado'),
    },
  },
  '/api/admin/persona-admin/rol': {
    get: { tags: ['Administradores'], summary: 'Selector de roles para administradores', responses: okResp() },
  },
  '/api/admin/persona-admin/{id}': {
    get: { tags: ['Administradores'], summary: 'Obtener administrador por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Administradores'],
      summary: 'Actualizar administrador',
      parameters: [idParam],
      requestBody: jsonBody({
        cargo: { type: 'string' },
        cedula_identidad: { type: 'string' },
        ci_expedido: { type: 'string' },
        nombre: { type: 'string' },
        apellido_paterno: { type: 'string' },
        apellido_materno: { type: 'string' },
        rol_id: { type: 'integer' },
        contrasenia: { type: 'string' },
      }),
      responses: okResp('Administrador actualizado'),
    },
  },
  '/api/admin/persona-admin/cambiar-estado/{id}': {
    patch: { tags: ['Administradores'], summary: 'Cambiar estado de administrador', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/calle': {
    get: {
      tags: ['Calles'],
      summary: 'Listar calles/ramales',
      parameters: [...paginationParams, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
      responses: okResp(),
    },
    post: {
      tags: ['Calles'],
      summary: 'Crear calle/ramal',
      requestBody: jsonBody({ nombre_calle: { type: 'string', example: 'Av. Villazon' } }, ['nombre_calle']),
      responses: okResp('Calle creada'),
    },
  },
  '/api/admin/calle/{id}': {
    get: { tags: ['Calles'], summary: 'Obtener calle por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Calles'],
      summary: 'Actualizar calle',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_calle: { type: 'string' } }, ['nombre_calle']),
      responses: okResp('Calle actualizada'),
    },
  },
  '/api/admin/calle/cambiar-estado/{id}': {
    patch: { tags: ['Calles'], summary: 'Activar o desactivar calle', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/tarifa': {
    get: {
      tags: ['Tarifas'],
      summary: 'Listar tarifas y sus rangos de consumo',
      parameters: [...paginationParams, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
      responses: okResp(),
    },
    post: {
      tags: ['Tarifas'],
      summary: 'Crear tarifa con rangos',
      requestBody: jsonBody(
        {
          nombre_tarifa: { type: 'string', example: 'Domiciliaria' },
          rangos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                consumo_minimo: { type: 'integer', example: 0 },
                consumo_maximo: { type: 'integer', nullable: true, example: 10 },
                precio: { type: 'number', example: 15 },
              },
            },
          },
        },
        ['nombre_tarifa', 'rangos'],
      ),
      responses: okResp('Tarifa creada'),
    },
  },
  '/api/admin/tarifa/{id}': {
    get: { tags: ['Tarifas'], summary: 'Obtener tarifa por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Tarifas'],
      summary: 'Actualizar tarifa y sus rangos',
      parameters: [idParam],
      requestBody: jsonBody({ nombre_tarifa: { type: 'string' }, rangos: { type: 'array', items: { type: 'object' } } }),
      responses: okResp('Tarifa actualizada'),
    },
  },
  '/api/admin/tarifa/cambiar-estado/{id}': {
    patch: { tags: ['Tarifas'], summary: 'Activar o desactivar tarifa', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/socio': {
    get: {
      tags: ['Socios'],
      summary: 'Listar socios paginados',
      parameters: [...paginationParams, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
      responses: okResp(),
    },
    post: {
      tags: ['Socios'],
      summary: 'Registrar nuevo socio',
      requestBody: jsonBody(
        {
          ci_socio: { type: 'integer', example: 80000010 },
          ci_expedido: { type: 'string', example: 'CB' },
          nombres: { type: 'string' },
          primer_apellido: { type: 'string' },
          segundo_apellido: { type: 'string' },
          numero_celular: { type: 'string', example: '70000010' },
          numero_telefono: { type: 'string' },
          genero: { type: 'string', enum: ['MASCULINO', 'FEMENINO'] },
          direccion: { type: 'string' },
        },
        ['ci_socio', 'ci_expedido', 'nombres', 'numero_celular', 'genero', 'direccion'],
      ),
      responses: okResp('Socio creado'),
    },
  },
  '/api/admin/socio/{id}': {
    get: { tags: ['Socios'], summary: 'Obtener socio por ID', parameters: [idParam], responses: okResp() },
    patch: {
      tags: ['Socios'],
      summary: 'Actualizar socio',
      parameters: [idParam],
      requestBody: jsonBody({
        nombres: { type: 'string' },
        primer_apellido: { type: 'string' },
        segundo_apellido: { type: 'string' },
        numero_celular: { type: 'string' },
        direccion: { type: 'string' },
      }),
      responses: okResp('Socio actualizado'),
    },
  },
  '/api/admin/socio/detalle/{id}': {
    get: { tags: ['Socios'], summary: 'Detalle completo del socio (con acciones)', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/socio/cambiar-estado/{id}': {
    patch: { tags: ['Socios'], summary: 'Activar o desactivar socio', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/gestion': {
    get: { tags: ['Gestiones y Periodos'], summary: 'Listar gestiones', parameters: paginationParams, responses: okResp() },
    post: {
      tags: ['Gestiones y Periodos'],
      summary: 'Crear gestión anual (genera sus 12 periodos)',
      requestBody: jsonBody({ anio: { type: 'integer', example: 2027 } }, ['anio']),
      responses: okResp('Gestión creada'),
    },
  },
  '/api/admin/gestion/{id}': {
    get: { tags: ['Gestiones y Periodos'], summary: 'Obtener gestión por ID con sus periodos', parameters: [idParam], responses: okResp() },
  },
  '/api/admin/gestion/periodo': {
    get: { tags: ['Gestiones y Periodos'], summary: 'Listar periodos de la gestión activa', parameters: paginationParams, responses: okResp() },
  },
  '/api/admin/gestion/periodo/select': {
    get: { tags: ['Gestiones y Periodos'], summary: 'Selector de periodos', responses: okResp() },
  },
  '/api/admin/gestion/periodo/cerrar/{id}': {
    patch: { tags: ['Gestiones y Periodos'], summary: 'Cerrar periodo activo y abrir el siguiente', parameters: [idParam], responses: okResp('Periodo cerrado') },
  },
};
