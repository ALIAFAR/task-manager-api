# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем остальной код
COPY . .

# Создаем папку для логов
RUN mkdir -p /app/logs

# Открываем порт
EXPOSE 7000

# Запускаем приложение
CMD ["node", "index.js"]