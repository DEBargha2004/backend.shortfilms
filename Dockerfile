# Stage 1: Build
FROM node:20-slim AS builder

# Install necessary build tools and enable pnpm
RUN apt-get update && apt-get install -y python3 make g++ && \
    corepack enable pnpm

WORKDIR /app

# Copy configuration files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Prune dev dependencies to save space and avoid second install in runner
RUN pnpm prune --prod

# Stage 2: Runner
FROM node:20-slim AS runner

# Enable pnpm for any runtime needs (optional but good practice)
RUN corepack enable pnpm

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy configuration and pruned node_modules + dist from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Use a non-root user
USER node

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/main"]
