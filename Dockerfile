FROM node:22.12.0-alpine3.20 AS base
WORKDIR /app
RUN npm i -g pnpm


FROM base AS development

FROM base AS production