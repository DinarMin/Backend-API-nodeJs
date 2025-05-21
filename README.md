# 🛠️ Backend API

REST API с авторизацией, задачами, магазином, погодой и калькулятором.

## Feature
- Auth: JWT, RBAC, bcrypt
- Tasks: CRUD, пагинация, Bull
- Shop: продукты, корзина, заказы
- Weather: API-интеграция
- Calculator: вычисления
- Tests: Jest, Supertest
- Deploy: Render, HTTPS

## ⚙️ Установка
```bash
git clone https://github.com/DuHaPuK/Backend-API-nodeJs.git  # Клонировать
```
#Настроить .env
```
API_KEY= your_api_key
JWT_SECRET= your_jwt_secret
PGDATABASE= your_pg-database
PGHOST= your_pg-host
PGPASSWORD= your_pg-password
PGPORT=5432
PGUSER= your_pg_user
```
```
npm run mon # Запустить
```

## Демо
https://backend-api-nodejs-mdo2.onrender.com
