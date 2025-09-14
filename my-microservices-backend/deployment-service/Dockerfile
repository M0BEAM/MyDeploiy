# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY ./deployment-service/package.json ./deployment-service/package-lock.json ./
# Install dependencies
RUN npm ci

# Copy and generate Prisma schema
COPY ./prisma-schema/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
COPY ./prisma-schema/prisma/migrations ./prisma/migrations/
# Copy application code
COPY ./deployment-service/ .

# Build application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install Prisma dependencies
RUN apk add --no-cache openssl
# Install git and openssh for repository operations
RUN apk add --no-cache git openssh   
# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3010 3009
CMD ["node", "dist/main"]