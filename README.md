# Task Manager API

REST API для системы учета задач с авторизацией. Приложение позволяет пользователям регистрироваться, входить в систему и управлять своими задачами.

## Функционал

- **Аутентификация и авторизация**
  - `POST /register` — регистрация нового пользователя (email и password)
  - `POST /login` — вход в систему, возвращает JWT токен

- **Управление задачами** (все маршруты защищены JWT middleware)
  - `GET /todos` — получить список задач текущего пользователя
  - `POST /todos` — создать задачу (поля: `title`, `description`, `status`)
  - `PATCH /todos/:id` — обновить статус задачи
  - `DELETE /todos/:id` — удалить задачу

## 🛠 Технологии

- Node.js + Express
- PostgreSQL + Sequelize
- JWT для аутентификации
- bcrypt для хеширования паролей
- class-validator для валидации данных
- Jest для unit-тестов
- Docker и Docker Compose

## 📦 Запуск через Docker

### Предварительные требования

- Установленный Docker и Docker Compose

### Установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/ALIAFAR/task-manager-api.git
   cd task-manager-api
2. Запустите приложение:
   docker-compose up -d
Приложение доступно по адресу: http://localhost:7000
3. Остановка приложения
   docker-compose down
4. Запуск тестов
   npm test
