import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";

import User from "./models/User.js";
import { Auth } from "../utils/auth.js";
import Task from "./models/Task.js";
import {
  registerSchema,
  loginSchema,
  weatherSchema,
  taskSchema,
} from "../validations/validation.js";
import logger from "../utils/logger.js";
import checkPermissions from "../utils/rbac.js";
import pool from "../db/postgres.js";

dotenv.config();

/* Создаем приложение на express */

const app = express();
app.use(cors());
app.use(express.json());
app.listen(3000, () => console.log("Server on port 3000")); // Запускаем сервер на 3000 порту.

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

/* Функция валидации принимаемых данных */

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body || req.params);
  const text = req.body.text;
  if (error) {
    logger.warn(`Validation failed: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }
  console.log(" Валидация прошла успешно! ");
  if (text) {
    logger.info(`Валидация прошла успешно! text: ${text}`);
  }
  next();
};

/* Принимает данные для регистрации и авторизации*/

app.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (email.length > 0) {
      if (name) {
        // При регистрации принимает данные и сохраняет в БД
        const { error } = registerSchema.validate({ name, email, password });
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
          [name, email, hashedPassword, role || "user"]
        );
        await logger.info(`Регистрация прошла успешно! email: ${email}`);
        res.json({ message: "User registered" });
      } else {
        // При авторизации принимает данные и проверяет и назначает token
        const { error } = loginSchema.validate({ email, password });
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: "Неверный пароль или логин!" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        logger.info(`Авторизация прошла успешно! email: ${email}`);
        res.json({ token });
      }
    } else {
      res.status(403).json({ message: "Слишком короткий email или Имя" });
    }
  } catch (error) {
    res.status(404).json({ error });
    console.log("Произошла ошибка ->" + error);
  }
});

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
    logger.info();
  } catch (err) {
    console.error(err);
  }
});

/* Обработка запроса на получение данных о погоде, в теле запроса отправляется название города  */

app.post("/weatherMe", Auth, validate(weatherSchema), async (req, res) => {
  try {
    const city = req.body.city;
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`
    );
    res.json({
      city: response.data.location.name,
      temp: response.data.current.temp_c,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/* Работа с задачами */

/* Добавление задачи в БД */

app.post("/taskNest", Auth, validate(taskSchema), async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, req.userId]
    );
    res.json({ message: "Задача успешно добавлена", result: result.rows[0] });
  } catch (err) {
    console.log(err);
  }
});

/* Запрос список задач с БД */

app.get("/taskNest", Auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [
      req.userId,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

/* Изменение статуса задачи (выполнено / не выполнено)*/

app.put("/taskNest", Auth, async (req, res) => {
  try {
    const { status, taskId } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
      [status, taskId, req.userId]
    );
    const task = result.rows;
    if (task.length === 0) {
      return res.status(404).json({
        message: "Произошла ошибка, задача не найдена в базе данных!",
      });
    }
    res.json({ task: task });
  } catch (error) {
    console.log(error);
  }
});

/* Удаление задачи из БД */

app.delete("/taskNest", Auth, async (req, res) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id= $1 AND user_id= $2 RETURNING *",
    [req.body.id, req.userId]
  );
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Произошла ошибка, задача не найдена в базе данных!",
    });
  }
  res.json({ message: "Задача успешно удалена!" });
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
