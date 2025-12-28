# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

COPY . .

# Build the project
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
