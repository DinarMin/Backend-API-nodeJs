import pool from "../../db/postgres.js";

const createOrder = async (userId, cartItems) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const order = await client.query(
      "INSERT INTO orders (user_id) VALUES ($1) RETURNING id",
      [userId]  
    );
    const orderId = order.rows[0].id;
    for (const item of cartItems) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.product_id, item.quantity]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }
    await client.query("DELETE FROM cart WHERE user_id = $1", [userId]);
    await client.query("COMMIT");
    return order.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default { createOrder };
