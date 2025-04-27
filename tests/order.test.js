import request from "supertest";
import { app } from "../server/server.js";
import pool from "../db/postgres.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("Orders API", () => {
  let token, userId, productId;

  beforeAll(async () => {
    await pool.query("DELETE FROM order_items");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM cart");
    await pool.query("DELETE FROM products");
    await pool.query("DELETE FROM users");

    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      ["orderTest", "orderTest@mail.net", hashedPassword]
    );
    userId = user.rows[0].id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    const product = await pool.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING id",
      ["Laptop", 999.99, 10]
    );
    productId = product.rows[0].id;
    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [userId, productId, 2]
    );
  });

  afterAll(() => pool.end());

  it("Создание заказа", async () => {
    const res = await request(app).post("/orders").set("Authorization", token);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Order created");
    const cart = await pool.query("SELECT * FROM cart WHERE user_id = $1", [
      userId,
    ]);
    expect(cart.rows.length).toBe(0);
    const stock = await pool.query("SELECT stock FROM products WHERE id = $1", [
      productId,
    ]);
    expect(stock.rows[0].stock).toBe(8);
  });
});
