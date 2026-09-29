# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

FROM base AS runner
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=3333
EXPOSE 3333
COPY --from=build /app/build ./
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
CMD ["node", "bin/server.js"]
