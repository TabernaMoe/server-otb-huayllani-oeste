# Portal Socio - filtros por acción

Cambios principales:

- `GET /api/socio/me/acciones`
  - Ahora devuelve también `tipo` y `detalles` obtenidos desde `detalle_pago_accion` + `tipos_accion`.
- `GET /api/socio/me/lecturas?accion_id=ID`
  - Filtra lecturas por acción y además valida implícitamente que la acción pertenezca al socio autenticado.
  - Sin `accion_id`, conserva el comportamiento anterior y devuelve todas las lecturas del socio.
- `GET /api/socio/me/cobros?accion_id=ID`
  - Filtra cobros generales y de agua por acción.
  - Sin `accion_id`, conserva el comportamiento anterior.
- El mapeo de respuestas se separó a `portalSocio.mappers.js`.
- `getResumen()` sigue trabajando con todas las acciones/cobros/lecturas del socio.

No se agregaron nuevas rutas: se reutilizan las existentes mediante query params.
