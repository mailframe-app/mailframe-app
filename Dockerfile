# --- СТАДИЯ 1: Сборка основного приложения ---
FROM node:24-alpine AS app_builder
WORKDIR /app
COPY package*.json ./
COPY bun.lock ./
RUN npm install --include=dev
COPY . .
# Переменные для основного приложения
ARG VITE_API_BASE_URL
ARG VITE_COOKIE_DOMAIN
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
RUN echo "VITE_COOKIE_DOMAIN=${VITE_COOKIE_DOMAIN}" >> .env
RUN echo "VITE_EDITOR_URL=" >> .env
RUN npm run build

# --- СТАДИЯ 2: Сборка эдитора ---
FROM node:24-alpine AS editor_builder
WORKDIR /app/editor-app
# Копируем только файлы, нужные для установки зависимостей эдитора
COPY editor-app/package*.json ./
COPY editor-app/bun.lock ./
RUN npm install --include=dev
# Копируем все исходники эдитора
COPY editor-app/ .
# Переменные для эдитора
ARG VITE_API_BASE_URL
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
# Собираем эдитор с правильным базовым путем
RUN npm run build -- --base=/editor/

# --- ФИНАЛЬНАЯ СТАДИЯ: Nginx ---
FROM nginx:alpine
# Копируем готовую конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем сборку основного приложения в корень
COPY --from=app_builder /app/dist /usr/share/nginx/html
# Копируем сборку эдитора в подпапку /editor
COPY --from=editor_builder /app/editor-app/dist /usr/share/nginx/html/editor

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 