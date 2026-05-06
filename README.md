# Comando para ejecutar el servidor

- docker compose up --build

# Backend Server

Backend desarrollado con:

- Node.js
- Express
- PostgreSQL
- Sequelize
- Docker
- Docker Compose

---

# ¿Qué es Docker?

Docker es una plataforma que permite ejecutar aplicaciones dentro de contenedores.

Un contenedor es un entorno aislado que incluye:

- sistema base
- dependencias
- librerías
- runtime
- configuración

Esto permite que el proyecto funcione igual en:

- Windows
- Linux
- Mac
- VPS
- producción

---

# Diferencia entre Docker y Máquina Virtual

## Máquina Virtual

Una máquina virtual instala:

- sistema operativo completo
- kernel completo
- servicios completos

Consume muchos recursos.

---

## Docker

Docker comparte el kernel del sistema operativo anfitrión.

Por eso es:

- más ligero
- más rápido
- más portable

---

# ¿Qué es una Imagen?

Una imagen es una plantilla para crear contenedores.

Ejemplo:

```text
node:22-alpine
```

Incluye:

- Node.js 22
- Alpine Linux

---

# ¿Qué es un Contenedor?

Un contenedor es una instancia en ejecución de una imagen.

Ejemplo:

```bash
docker run node:22-alpine
```

---

# Flujo de Docker

```text
Dockerfile
    ↓
Imagen
    ↓
Contenedor
```

---

# Dockerfile

El Dockerfile define cómo construir la imagen del proyecto.

Ejemplo:

```Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

# Explicación del Dockerfile

## FROM

```Dockerfile
FROM node:22-alpine
```

Usa Node.js 22 sobre Alpine Linux.

Alpine es una distribución ligera.

---

## WORKDIR

```Dockerfile
WORKDIR /app
```

Define la carpeta de trabajo dentro del contenedor.

---

## COPY

```Dockerfile
COPY package*.json ./
```

Copia package.json y package-lock.json.

---

## RUN

```Dockerfile
RUN npm install
```

Instala dependencias.

---

## COPY . .

```Dockerfile
COPY . .
```

Copia todo el proyecto.

---

## EXPOSE

```Dockerfile
EXPOSE 3000
```

Indica que el contenedor usa el puerto 3000.

---

## CMD

```Dockerfile
CMD ["npm", "run", "dev"]
```

Comando que se ejecuta al iniciar el contenedor.

---

# ¿Qué es Docker Compose?

Docker Compose permite ejecutar múltiples contenedores juntos.

Ejemplo:

- backend
- base de datos
- redis
- nginx

Todo desde un solo archivo.

---

# docker-compose.yml

Ejemplo:

```yaml
services:
  server:
    build: .
    container_name: backend_server
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:17
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# Explicación Docker Compose

## services

Define los contenedores.

---

## build

```yaml
build: .
```

Construye la imagen usando el Dockerfile actual.

---

## image

```yaml
image: postgres:17
```

Usa una imagen oficial de Docker Hub.

---

## ports

```yaml
ports:
  - '3000:3000'
```

Conecta:

```text
PC:3000 → Contenedor:3000
```

Formato:

```text
HOST:CONTENEDOR
```

---

## volumes

```yaml
volumes:
  - .:/app
```

Sincroniza archivos entre:

```text
PC ↔ Contenedor
```

Permite desarrollo en tiempo real.

---

## env_file

```yaml
env_file:
  - .env
```

Carga variables de entorno.

---

## depends_on

```yaml
depends_on:
  - postgres
```

Indica que el backend depende de PostgreSQL.

---

# Volúmenes

Los volúmenes permiten persistencia de datos.

Ejemplo:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

Aunque elimines el contenedor:

- la base de datos sigue existiendo

---

# Comandos básicos Docker

## Construir contenedores

```bash
docker compose build
```

---

## Iniciar contenedores

```bash
docker compose up
```

---

## Iniciar en segundo plano

```bash
docker compose up -d
```

---

## Detener contenedores

```bash
docker compose down
```

---

## Ver contenedores

```bash
docker ps
```

---

## Ver logs

```bash
docker compose logs
```

---

## Entrar al contenedor

```bash
docker exec -it backend_server sh
```

---

# Arquitectura del proyecto

```text
Usuario
   ↓
Frontend
   ↓
Backend Express
   ↓
PostgreSQL
```

---

# Arquitectura usando Docker

```text
Usuario
   ↓
Frontend
   ↓
Contenedor Backend
   ↓
Contenedor PostgreSQL
```

---

# Ventajas de Docker

- entorno consistente
- despliegue sencillo
- fácil escalabilidad
- aislamiento
- portabilidad
- instalación rápida
- mismo entorno desarrollo/producción

---

# .dockerignore

Archivo usado para evitar copiar archivos innecesarios.

Ejemplo:

```dockerignore
node_modules
.env
.git
uploads
```

---

# .gitignore

Archivos que Git no debe subir.

Ejemplo:

```gitignore
node_modules
.env
uploads
```

---

# Variables de entorno

Ejemplo:

```env
PORT=3000

DB_HOST=postgres
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=secret
```

---

# Flujo completo del proyecto

```text
Código fuente
      ↓
Dockerfile
      ↓
Imagen Docker
      ↓
Docker Compose
      ↓
Contenedores
      ↓
Aplicación funcionando
```

---

# Producción

En producción normalmente se usa:

- VPS
- Docker
- Docker Compose
- Nginx
- Cloudflare

Arquitectura típica:

```text
Usuario
   ↓
Cloudflare
   ↓
Nginx
   ↓
Contenedor Backend
   ↓
PostgreSQL
```

---

# Recomendaciones

- nunca subir `.env`
- usar `.dockerignore`
- usar volúmenes para PostgreSQL
- separar frontend y backend
- usar imágenes ligeras
- usar variables de entorno
- usar Docker Compose para desarrollo

---
