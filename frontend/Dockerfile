# Base stage (common dependencies)
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# Development Stage
FROM base AS dev
ENV NODE_ENV=development
COPY . . 
CMD ["pnpm", "dev"]

# Production Stage
FROM base AS prod
ENV NODE_ENV=production
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]