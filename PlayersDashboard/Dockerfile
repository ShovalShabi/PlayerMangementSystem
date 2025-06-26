# syntax=docker/dockerfile:1

# --- Base Node image for build and dev ---
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# --- Development image ---
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

# --- Production build ---
FROM base AS build
COPY . .
RUN npm run build

# --- Production Nginx image ---
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]