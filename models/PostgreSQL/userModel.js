import pool from "../../db/postgres.js";

const create = async ({ name, email, hashedPassword, role }) => {
  try {
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, hashedPassword, role || "user"]
    );
  } catch (err) {
    throw err;
  }
};

const check = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};
export default { create, check };
