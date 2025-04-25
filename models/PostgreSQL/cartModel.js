import pool from "../../db/postgres.js";

const addToCart = async () => {
  const res = await pool.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [userId, productId, quantity]
  );
  return res.rows[0];
};

const getToCart = async (userId) => {
  const res = await pool.query(
    "SELECT c.*, p.name, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1",
    [userId]
  );
  return res.rows;
};

export default { addToCart, getToCart };
