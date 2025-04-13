import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool();

const startDBpostgres = async () => {
  try {
    const client = await pool.connect();
    console.log("Успешное подключение к PostgreSQL");
  } catch (error) {
    console.log("Не удалось подключиться к базам данных PostgreSQL: " + error);
  }
};

export {startDBpostgres, pool};
