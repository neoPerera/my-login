# Stage 1: Build React Router app with Node 24
FROM node:24-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production runtime with Node 24
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy built app (both client and server)
COPY --from=build /app/build ./build

# Copy public folder (includes env.js)
COPY public ./public

# Install production dependencies only
RUN npm ci --omit=dev

# Expose port and set environment
ENV PORT=4001
EXPOSE 4001

# Start the server
CMD ["npm", "run", "start"]