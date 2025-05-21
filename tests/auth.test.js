import request from "supertest";
import { app } from "../app/app.js";
import pool from "../db/postgres.js";
import bcrypt from "bcryptjs";

describe("Auth API", () => {
  beforeAll(async () => {
    await pool.query("DELETE FROM users");
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users");
    await pool.end();
  });

  it("Регистрация нового пользователя", async () => {
    const res = await request(app).post("/auth").send({
      name: "JestTest",
      email: "TestJest@gmail.net",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered");
  });

  it("Ошибка, такая почта уже существует", async () => {
    await request(app).post("/auth").send({
      name: "JestTest",
      email: "TestJest@gmail.net",
      password: "123456",
    });
    const res = await request(app)
      .post("/auth")
      .send({ name: "TestJest", email: "TestJest@gmail.net", password: "123456" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email already exists");
  });

  it("Авторизация", async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      ["test2", "test2@gmail.net", hashedPassword]
    );
    const res = await request(app)
      .post("/auth")
      .send({ email: "test2@gmail.net", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Ошибка, не правильный пароль", async () => {
    const res = await request(app)
      .post("/auth")
      .send({ email: "test2@gmail.net", password: "123456789" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Неверный логин или пароль!");
  });
});
