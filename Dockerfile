# Stage 1: Build
FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable pnpm

WORKDIR /app

# Copy configuration files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Runner
FROM node:20-alpine AS runner

# Enable pnpm
RUN corepack enable pnpm

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy configuration files
COPY package.json pnpm-lock.yaml ./

# Install ONLY production dependencies
RUN pnpm install --prod

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Use a non-root user for security
USER node

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/main"]
