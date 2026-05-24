# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy packages to cache dependency installations
COPY package*.json ./
RUN npm ci

# Copy code and compile the production build
COPY . .
RUN npm run build

# Stage 2: Serve the build directory via Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard web port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
