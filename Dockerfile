# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install
COPY . .
RUN npm run build

# --- Runtime stage (nginx) ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Cache policy: long cache for /assets, no-cache for HTML
RUN printf '%s\n'   'server {'   '  listen 80;'   '  server_name _;'   '  root /usr/share/nginx/html;'   '  index index.html;'   '  location /assets/ {'   '    add_header Cache-Control "public, max-age=31536000, immutable";'   '    try_files $uri =404;'   '  }'   '  location = /index.html {'   '    add_header Cache-Control "no-cache, no-store, must-revalidate";'   '  }'   '  location / {'   '    try_files $uri /index.html;'   '  }'   '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
