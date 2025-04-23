import pool from "../../db/postgres.js";

const createTask = async (title, userId) => {
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error in createTask:", err);
    throw err;
  }
};

const getAllTask = (userId) => {
  return pool.query("SELECT * FROM tasks WHERE user_id=$1", [userId]);
};

const updateStatus = (status, taskId, userId) => {
  return pool.query(
    "UPDATE tasks SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
    [status, taskId, userId]
  );
};

const deleteTask = (id, userId) => {
  return pool.query(
    "DELETE FROM tasks WHERE id= $1 AND user_id= $2 RETURNING *",
    [id, userId]
  );
};

const getTasksPag = async (userId, limit, offset) => {
  const res = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
    [userId, limit, offset]
  );
  return res.rows;
};

const getTotalPag = async (userId) => {
  const res = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
    [userId]
  );
  return res.rows[0].count;
};

export default {
  createTask,
  getAllTask,
  updateStatus,
  deleteTask,
  getTasksPag,
  getTotalPag,
};
