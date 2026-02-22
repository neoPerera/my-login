# Stage 1: Build React app with Node 24
FROM node:24-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve static build with NGINX
FROM nginx:alpine

# Copy React Router build output to NGINX (build/ contains index.html and assets)
COPY --from=build /app/build /usr/share/nginx/html

# Copy NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy public/ folder (includes env.js) to NGINX
COPY public/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]