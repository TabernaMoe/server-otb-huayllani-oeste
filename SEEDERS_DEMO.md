# Datos demo / seeders

El backend ahora **no elimina la base de datos en cada reinicio**. `RESET_DB_ON_START=false` es el valor normal.

## Arranque normal

```bash
docker compose up -d --build
```

## Cargar datos demo sin borrar datos existentes

```bash
docker compose exec backend npm run db:seed
```

El script es idempotente: usa `findOrCreate` para no duplicar el conjunto demo.

## Reiniciar completamente las tablas y cargar demo

> Este comando elimina los datos de las tablas de la aplicación. Úsalo solo en desarrollo.

```bash
docker compose exec backend npm run db:reset-seed
```

## Reinicio completo de PostgreSQL por Docker

```bash
docker compose down -v
docker compose up -d --build
docker compose exec backend npm run db:seed
```

## Credenciales demo

- Super admin: `super_admin` / `admin_super_admin`
- Secretaría: `secretaria_demo` / `Secretaria123!`
- Lecturador: `lecturador_demo` / `Lecturador123!`
- Socios: `80000001` a `80000008`; contraseña inicial igual al CI.

## Datos creados

- Permisos y roles base.
- Usuarios administrativos demo.
- 8 socios con cuentas de portal.
- 9 calles.
- 3 tarifas y rangos.
- 3 tipos de acción y 6 detalles de acción.
- 8 acciones de agua, incluyendo una PASIVA.
- 3 conceptos de alcantarillado y 5 acciones de alcantarillado.
- Gestión 2026 y 12 periodos; octubre está ACTIVO.
- Lecturas de agosto, septiembre y octubre para 6 acciones.
- Cobros de agua pendientes y pagados.
- Cobros generales de mantenimiento.
- Pagos y recibos demo para probar el portal del socio.
- Multas de prueba.
- Asamblea de octubre con distintos estados de asistencia.
