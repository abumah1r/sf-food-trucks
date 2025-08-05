ARG NODE_VERSION=22.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"
LABEL org.opencontainers.image.source https://github.com/abumah1r/sf-food-trucks

WORKDIR /app

ENV NODE_ENV="production"

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

COPY package-lock.json package.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build && npm prune --omit=dev

FROM base

COPY --from=build /app /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

EXPOSE 3000
CMD [ "npm", "run", "start" ]
