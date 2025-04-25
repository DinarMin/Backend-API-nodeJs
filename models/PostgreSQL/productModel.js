import pool from "../../db/postgres";

const getProducts = async () => {
  console.log("дошла до запроса в базу");
  const res = await pool.query("SELECT * FROM products");
  return res.rows;
};

const getProduct = async (id) => {
  const res = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return res.rows[0];
};

export default { getProducts, getProduct };
