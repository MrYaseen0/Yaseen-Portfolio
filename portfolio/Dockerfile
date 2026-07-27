FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
COPY server/package.json ./server/

FROM base AS deps
RUN npm ci --omit=dev
RUN cd server && npm install --omit=dev

FROM base AS build
RUN npm ci
RUN npx vite build

FROM node:20-alpine AS production
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=build /app/dist ./dist
COPY server/ ./server/
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 5000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server/index.js"]
