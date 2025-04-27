# Backend API

REST API с авторизацией, задачами, магазином, погодой и калькулятором.

## Features
- **Auth**: JWT, RBAC, bcrypt
- **Tasks**: CRUD, пагинация, Bull для уведомлений
- **Shop**: продукты, корзина, заказы с транзакциями
- **Weather**: интеграция с API
- **Calculator**: простые вычисления
- **Tests**: Jest, Supertest

## Setup
```bash
git clone https://github.com/DuHaPuK/learning-nodeJs.git  # Клонировать
npm install                        # Установить
cp .env.example .env               # Настроить .env
psql -U postgres -d myapp -f migrations/* # Миграции
npm start                          # Запустить

Endpoints
Auth

register
POST /
bash

curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"name":"test", "email":"test@example.com","password":"123456"}'

login
POST /
bash

curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

Tasks
GET /tasks?page=1&limit=10
bash

curl -X GET http://localhost:3000/tasks?page=1&limit=10 \
  -H "Authorization: <your-token>"

Shop
GET /products

POST /cart
bash

curl -X POST http://localhost:3000/cart \
  -H "Authorization: <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'

POST /api/orders
bash

curl -X POST http://localhost:3000/orders \
  -H "Authorization: <your-token>"

