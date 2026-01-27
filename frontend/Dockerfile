# Build the application
FROM node:18-alpine AS build
WORKDIR /app

# Accept build argument for API base URL
ARG VITE_API_BASE=http://localhost:8080
ENV VITE_API_BASE=${VITE_API_BASE}

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies for building (allow lockfile update if mismatched)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Serve the built application with Nginx 
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config //optional
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
