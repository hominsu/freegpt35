FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json .yarnrc.yml* yarn.lock* ./
COPY .yarn/ ./.yarn/
RUN yarn --frozen-lockfile
RUN npm install -g --platform=linux --libc=glibc sharp


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN --mount=type=secret,id=NEXT_PUBLIC_BASE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_API_URL \
    --mount=type=secret,id=NEXT_PUBLIC_CRON \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_ENABLE \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_PROTOCOL \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_HOST \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_PORT \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_AUTH \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_USERNAME \
    --mount=type=secret,id=NEXT_PUBLIC_PROXY_PASSWORD \
    NEXT_PUBLIC_BASE_URL=$(cat /run/secrets/NEXT_PUBLIC_BASE_URL) \
    NEXT_PUBLIC_API_URL=$(cat /run/secrets/NEXT_PUBLIC_API_URL) \
    NEXT_PUBLIC_CRON=$(cat /run/secrets/NEXT_PUBLIC_CRON) \
    NEXT_PUBLIC_PROXY_ENABLE=$(cat /run/secrets/NEXT_PUBLIC_PROXY_ENABLE) \
    NEXT_PUBLIC_PROXY_PROTOCOL=$(cat /run/secrets/NEXT_PUBLIC_PROXY_PROTOCOL) \
    NEXT_PUBLIC_PROXY_HOST=$(cat /run/secrets/NEXT_PUBLIC_PROXY_HOST) \
    NEXT_PUBLIC_PROXY_PORT=$(cat /run/secrets/NEXT_PUBLIC_PROXY_PORT) \
    NEXT_PUBLIC_PROXY_AUTH=$(cat /run/secrets/NEXT_PUBLIC_PROXY_AUTH) \
    NEXT_PUBLIC_PROXY_USERNAME=$(cat /run/secrets/NEXT_PUBLIC_PROXY_USERNAME) \
    NEXT_PUBLIC_PROXY_PASSWORD=$(cat /run/secrets/NEXT_PUBLIC_PROXY_PASSWORD) \
    yarn build


# Production image, copy all the files and run next
FROM base AS runner

# image info
ARG AUTHOR_NAME
ARG AUTHOR_EMAIL
ARG VERSION

# label
LABEL author=${AUTHOR_NAME} email=${AUTHOR_EMAIL} version=${VERSION}

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp
#COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
