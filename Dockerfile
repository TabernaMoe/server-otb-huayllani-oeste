# ─── Etapa base ───────────────────────────────
FROM node:22-alpine AS base

# Define la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./


RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ─── Etapa desarrollo ─────────────────────────
FROM base AS development

# Instala todas las dependencias
RUN npm ci

# Copia todo el proyecto al contenedor
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]

# ─── Etapa producción ─────────────────────────
FROM base AS production

# Instala solo las dependencias necesarias para producción
RUN npm ci --omit=dev

# Copia todo el proyecto al contenedor
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para producción
CMD ["npm", "run", "start"]