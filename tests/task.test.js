import request from "supertest";
import { app } from "../app/app.js";
import pool from "../db/postgres.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

describe("Tasks API", () => {
  let token, userId;

  beforeAll(async () => {
    await pool.query("DELETE FROM tasks");
    await pool.query("DELETE FROM users");
    const hashedPassword = await bcrypt.hash("1234567", 10);
    const res = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      ["jestTestTask", "test@gmail.net", hashedPassword]
    );
    userId = res.rows[0].id;
    token = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("Создание задачи", async () => {
    const res = await request(app)
      .post("/taskNest")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ title: "Test Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Задача успешно добавлена");
  });

  it("Получение задачи", async () => {
    await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
      "Test Task",
      userId,
    ]);
    const res = await request(app).get("/taskNest").set("Authorization", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it("Обновление статуса задачи", async () => {
    const task = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING id",
      ["Update task", userId]
    );
    const res = await request(app)
      .put("/taskNest")
      .set("Authorization", token)
      .send({
        taskId: task.rows[0].id,
        status: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(res.body);
  });

  it("Удаление задачи", async () => {
    const task = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING id",
      ["Delete task", userId]
    );
    const res = await request(app)
      .delete("/taskNest")
      .set("Authorization", token)
      .send({
        taskId: task.rows[0].id,
      });
    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });
});
