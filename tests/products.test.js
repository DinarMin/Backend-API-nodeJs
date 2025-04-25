import request from "supertest";
import pool from "../db/postgres.js";
import { app } from "../server/server.js";

describe("Products API", () => {
  beforeAll(async () => {
    await pool.query("DELETE FROM products");
    await pool.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3)",
      ["Laptop", 999.99, 10]
    );
  });

  afterAll(async () => {
    pool.end();
  });
  
  it("Запрос список продуктов", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Laptop");
  });
});
