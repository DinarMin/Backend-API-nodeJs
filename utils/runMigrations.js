import fs from "fs";
import path from "path";
import pool from "../db/postgres.js";

export const runMigrations = async () => {
  const migrationFiles = fs.readdirSync("./migrations").sort();

  for (const file of migrationFiles) {
    const filePath = path.join("./migrations", file);
    const sql = fs.readFileSync(filePath, "utf8");

    try {
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`Migration ${file} completed`);
    } catch (error) {
      console.error(`Error executing migration ${file}:`, error);
    }
  }
};
