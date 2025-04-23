import request from "supertest";
import { app } from "../server/server.js";
import pool from "../db/postgres.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

describe("Проверка API Pagination", () => {
  let token, userId;

  beforeAll(async () => {
    await pool.query("DELETE FROM users");
    await pool.query("DELETE FROM tasks");
    const hashedPassword = await bcrypt.hash("1234567", 10);
    const res = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      ["testPag", "testPag@gmal.net", hashedPassword]
    );
    userId = res.rows[0].id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "60d",
    });
    for (let i = 1; i <= 15; i++) {
      await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
        `Tasks ${i}`,
        userId,
      ]);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it("Получить часть задач на страницу", async () => {
    const res = await request(app)
      .get("/taskNest?page=2&limit=5")
      .set("Authorization", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBe(5);
    expect(res.body.total).toBe(15);
    expect(res.body.page).toBe(2);
    expect(res.body.pages).toBe(3);
  });
});
