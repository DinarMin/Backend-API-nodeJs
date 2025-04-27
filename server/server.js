import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import https from "https";
import http from "http";

import User from "../models/Mongo/User.js";
import { Auth } from "../utils/auth.js";
import Task from "../models/Mongo/Task.js";
import { validate, weatherSchema } from "../validations/validation.js";
import logger from "../utils/logger.js";
import checkPermissions from "../utils/rbac.js";
import pool from "../db/postgres.js";
import routesCalculation from "../routes/calculatorRoutes.js";
import { userController } from "../controllers/userController.js";
import taskNestRoutes from "../routes/taskRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import cartRoutes from "../routes/cartRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";

export const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(443, () => {
  console.log("Server on port 443 (HTTPS)");
});

http.createServer(app).listen(3000, () => {
  console.log("Server on port 3000 (HTTP)");
});

/* Создаем приложение на express */

// app.listen(3000, () => {
//   logger.info("Сервер успешно запущен на 3000 порту");
//   console.log("Server on port 3000");
// });

/* Подключение к базы данных MongoDB */

async function startDB() {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Успешно подключена к MongoDB");
  } catch (e) {
    console.log(e + "Подключение прервано");
  }
}

// startDB();

/* Обработка регистрации и авторизации */
app.post("/", userController);

/* Роутер задач */
app.use("/taskNest", taskNestRoutes);

/* Роутер калькулятора */
app.use("/api/calculate", routesCalculation);

/* Роутеры магазина ------------------------- */

/* Роутер продуктов */
app.use("/products", productRoutes);

/* Роутер корзины */
app.use("/cart", cartRoutes);

/* Роутер заказа */
app.use("/orders", orderRoutes);  

/* Обработка запроса на авторизованного юзера с Middleware */
app.get("/api/protected", Auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.userId,
    ]);
    const user = result.rows[0];
    await res.json({
      userID: user.id,
      create: user.created_at,
    });
    console.log("Все хорошо, запрос был доставлен и обработан");
  } catch (err) {
    console.error(err);
  }
});

/* Погода --------------------------------- */

/* Обработка запроса на получение данных о погоде, в теле запроса отправляется название города  */
app.post("/weatherMe", Auth, validate(weatherSchema), async (req, res) => {
  try {
    const city = req.body.city;
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`
    );
    const data = {
      city: response.data.location.name,
      temp: response.data.current.temp_c,
    };
    await pool.query(
      "INSERT INTO weather_history (city, temp, user_id) VALUES ($1, $2, $3) ",
      [data.city, data.temp, req.userId]
    );
    logger.info(
      `Weather fetched: ${data.city}, ${data.temp}°C for user ${req.userId}`
    );
    res.json(data);
  } catch (err) {
    logger.error(`Weather error: ${err.message}`);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

/* Получение истории погоды  */
app.get("/weatherMe/history", Auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT city, temp, created_at FROM weather_history WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    logger.info(
      `Запрос список истории запросов погоды предоставлено! user: ${req.userId}`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.warn(
      `Не удалось получить список истории запросов погоды! user: ${req.userId}`
    );
    res.status(404).json(error);
  }
});

/* Запрос список всех юзеров по админ роли */
app.get(
  "/api/admin/users",
  Auth,
  checkPermissions("users:read"),
  async (req, res) => {
    const users = await User.find();
    logger.info(`Admin ${req.userId} fetched all users`);
    res.status(200).json(users);
  }
);

/* Запрос список всех задач по админ роли */
app.get(
  "/api/admin/tasks",
  Auth,
  checkPermissions("tasks:manage"),
  async (req, res) => {
    const tasks = await Task.find();
    logger.info(`Admin ${req.userId} fetched all tasks`);
    res.status(200).json(tasks);
  }
);

app.use((err, req, res, next) => {
  console.error("Необработанная ошибка:", err);
  res.status(500).json({ error: err.message });
});
