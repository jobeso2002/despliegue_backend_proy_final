# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm run build

# Etapa final: runtime
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
# Instala solo prod (sin devDependencies)
RUN npm ci --omit=dev

# Copia el build
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
# (Opcional) Documenta el puerto que usas localmente
EXPOSE 4002

# En Render el PORT viene por env; tu main ya hace process.env.PORT || 4001
CMD ["node", "dist/main.js"]
