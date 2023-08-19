FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
# Создается node_modules
RUN npm ci --no-audit --no-fund
# Копируем локальную папку frontend в /app внутри контейнера
COPY . .
# Собрали /app/build
RUN npm run build

FROM nginx:alpine AS prod
# Копируем только /app/build
COPY --from=builder /app/build /usr/share/nginx/html
# Докидываем конфиг nginx
COPY frontent.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
