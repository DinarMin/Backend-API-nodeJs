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

dotenv.config();

/* Создаем приложение на express */
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3000, () => console.log("Server on port 3000")); // Запускаем сервер на 3000 порту.

/* Подключение к базы данных */

async function startDB() {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Успешно подключена к базам данных");
  } catch (e) {
    console.log(e + "Подключение прервано");
  }
}

startDB();

/* Принимает данные */

app.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (email.length > 0) {
      if (name) {
        // При регистрации принимает данные и сохраняет в БД
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User registered" });
      } else {
        // При авторизации принимает данные и проверяет и назначает token
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: "Неверный пароль или логин!" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
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
    const user = await User.findById(req.userId);
    await res.json({
      message: "Cool!",
      userId: req.userId,
      timestaps: user.createdAt,
    });
    console.log("Все хорошо, запрос был доставлен и обработан");
  } catch (err) {
    console.error(err);
  }
});

/* Обработка запроса на получение данных о погоде, в теле запроса отправляется название города  */

app.get("/weatherMe", Auth, async (req, res) => {
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

app.post("/taskNest", Auth, async (req, res) => {
  try {
    const { text } = req.body;
    const task = new Task({ text, userId: req.userId });
    await task.save();
    res.json({ message: "Задача успешно добавлена" });
  } catch (err) {
    console.log(err);
  }
});

/* Запрос список задач с БД */

app.get("/taskNest", Auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    console.log(error);
  }
});

/* Изменение статуса задачи (выполнено / не выполнено)*/

app.put("/taskNest", Auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.body.id },
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({
        message: "Произошла ошибка, задача не найдена в базе данных!",
      });
    }
    res.json({ status: status });
  } catch (error) {
    console.log(error);
  }
});

/* Удаление задачи из БД */

app.delete("/taskNest", Auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.body.id });
  if (!task) {
    return res.status(404).json({
      message: "Произошла ошибка, задача не найдена в базе данных!",
    });
  }
  res.json({ message: "Задача успешно удалена!" });
});


