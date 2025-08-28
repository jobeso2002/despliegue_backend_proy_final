# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm ci

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar el código construido
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 4001

# Comando para ejecutar
CMD ["node", "dist/main"]