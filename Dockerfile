FROM node:22-alpine AS build
WORKDIR /app
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/cake_shop?schema=public

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json tsconfig.build.json nest-cli.json ./
RUN apk add --no-cache python3 make g++ \
  && npm ci

COPY src ./src
RUN npx prisma generate && npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh
EXPOSE 3000
CMD ["./docker/entrypoint.sh"]
