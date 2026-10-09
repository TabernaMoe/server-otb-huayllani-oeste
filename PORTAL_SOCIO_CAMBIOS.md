# Integración portal del socio

## Flujo de autenticación

- El administrador crea un socio desde `POST /api/admin/socio`.
- Se crea automáticamente una cuenta con:
  - usuario: CI del socio
  - contraseña inicial: CI del socio (guardada con bcrypt)
  - rol: `usuario_normal`
  - cambio de contraseña inicial: obligatorio
- El login continúa en `POST /api/login`.
- El token JWT siempre usa el ID de `auth_usuarios`, tanto para administradores como para socios.
- `checkAuth` resuelve el tipo de cuenta y expone `req.usuario`.

## Endpoints del portal

Todos requieren `Authorization: Bearer <token>`.

- `GET /api/socio/me`
- `GET /api/socio/me/resumen`
- `GET /api/socio/me/acciones`
- `GET /api/socio/me/lecturas`
- `GET /api/socio/me/cobros`
- `GET /api/socio/me/recibos`
- `PATCH /api/socio/me/password`

`/api/cliente/*` queda como alias temporal por compatibilidad.

## Seguridad

El frontend nunca envía un `socio_id` para consultar información privada. El backend toma el socio desde el JWT y `req.usuario.socio_id`.
