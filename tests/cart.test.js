import request from "supertest";
import { app } from "../app/app.js";
import pool from "../db/postgres.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("Cart API", () => {
  let token, userId, productId;

  beforeAll(async () => {
    await pool.query("DELETE FROM cart");
    await pool.query("DELETE FROM products");
    await pool.query("DELETE FROM users");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id ",
      ["cartTest", "carttest@gmail.net", hashedPassword]
    );
    userId = user.rows[0].id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    const product = await pool.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING id",
      ["Laptop", 999.99, 10]
    );

    productId = product.rows[0].id;
  });

  afterAll(() => pool.end());

  it("Добавление в корзину", async () => {
    const res = await request(app)
      .post("/cart")
      .set("Authorization", token)
      .send({ productId, quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.quantity).toBe(2);
  });

  it("Получение корзины", async () => {
    const res = await request(app).get("/cart").set("Authorization", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Laptop");
  });
});
